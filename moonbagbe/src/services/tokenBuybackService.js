const {
  createWalletClient,
  http,
  getContract,
  erc20Abi,
  parseUnits,
  maxUint256,
  publicActions,
  concat,
  numberToHex,
  size,
  isAddress,
  getAddress,
} = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { base } = require("viem/chains");
const SupabaseService = require("./supabaseService");
const { config } = require("../config/env");
const { wethAbi } = require("../abi/abis");

class TokenBuybackService {
  constructor(BUYBACK_PERCENTAGE) {
    this.WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
    this.walletService = require("./walletManagement");
    this.BUYBACK_PERCENTAGE;
  }

  async getBuybackPercentage(walletAddress) {
    try {
      const walletData = await this.walletService.getWalletForUser(
        walletAddress
      );
      return walletData.moonbag_percent || 10; // Default to 10% if not set
    } catch (error) {
      console.error("Error fetching buyback percentage:", error);
      return 10; // Default fallback
    }
  }

  // Wallet Creation
  async createWalletClient(privateKey) {
    const cleanPrivateKey = this._sanitizePrivateKey(privateKey);
    return createWalletClient({
      account: privateKeyToAccount(`0x${cleanPrivateKey}`),
      chain: base,
      transport: http(config.RPC_URL),
    }).extend(publicActions);
  }

  _sanitizePrivateKey(privateKey) {
    const cleanPrivateKey = privateKey.replace("0x", "");
    if (cleanPrivateKey.length !== 64) {
      throw new Error(
        `Invalid private key length: ${cleanPrivateKey.length}. Expected 64 characters`
      );
    }
    return cleanPrivateKey;
  }

  // Contract Interactions
  _getWethContract(client) {
    return getContract({
      address: this.WETH_ADDRESS,
      abi: wethAbi,
      client,
    });
  }

  _getTokenContract(tokenAddress, client) {
    return getContract({
      address: getAddress(tokenAddress),
      abi: erc20Abi,
      client,
    });
  }

  // Price and Quote Functions
  async _getPriceQuote(params, headers) {
    const response = await fetch(
      "https://api.0x.org/swap/permit2/price?" + params.toString(),
      { headers }
    );
    return response.json();
  }

  async _getSwapQuote(params, headers) {
    const response = await fetch(
      "https://api.0x.org/swap/permit2/quote?" + params.toString(),
      { headers }
    );
    return response.json();
  }

  // Token Approval
  async _handleTokenApproval(weth, price, client) {
    if (price?.issues?.allowance !== null) {
      try {
        const { request } = await weth.simulate.approve([
          price.issues.allowance.spender,
          maxUint256,
        ]);
        console.log("Approving Permit2 to spend WETH...", request);

        const hash = await weth.write.approve(request.args);
        const receipt = await client.waitForTransactionReceipt({ hash });
        console.log("Approved Permit2 to spend WETH.", receipt);
      } catch (error) {
        console.log("Error approving Permit2:", error);
        throw error;
      }
    } else {
      console.log("Token already approved for Permit2");
    }
  }

  // Transaction Execution
  async _executeTransaction(quote, client) {
    const nonce = await client.getTransactionCount({
      address: client.account.address,
    });

    const signedTransaction = await client.signTransaction({
      account: client.account,
      chain: client.chain,
      gas: quote?.transaction.gas ? BigInt(quote.transaction.gas) : undefined,
      to: quote?.transaction.to,
      data: quote.transaction.data,
      value: quote?.transaction.value
        ? BigInt(quote.transaction.value)
        : undefined,
      gasPrice: quote?.transaction.gasPrice
        ? BigInt(quote.transaction.gasPrice)
        : undefined,
      nonce: nonce,
    });

    return client.sendRawTransaction({
      serializedTransaction: signedTransaction,
    });
  }

  // Transaction Receipt Handling
  async _handleTransactionReceipt(hash, client) {
    try {
      const receipt = await client.waitForTransactionReceipt({ hash });
      console.log("Transaction Receipt:", {
        status: receipt.status,
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice.toString(),
        blockNumber: receipt.blockNumber,
        logs: receipt.logs,
      });

      if (receipt.status === 0) {
        console.error("Transaction failed");
      }
      return receipt;
    } catch (error) {
      console.error("Error getting transaction receipt:", error);
      throw error;
    }
  }

  // Permit2 Signature Handling
  _handlePermit2Signature(quote, signature) {
    if (signature && quote?.transaction?.data) {
      const signatureLengthInHex = numberToHex(size(signature), {
        signed: false,
        size: 32,
      });
      return concat([quote.transaction.data, signatureLengthInHex, signature]);
    }
    return quote.transaction.data;
  }

  // Utility Functions
  isERC20Transfer(txData) {
    return Boolean(txData?.erc20Transfers?.length > 0);
  }

  calculateBuybackAmount(value, decimals) {
    return (value * BigInt(this.BUYBACK_PERCENTAGE)) / BigInt(100);
  }

  // Main Transaction Handler
  async handleTransaction(txData) {
    try {
      if (!this.isERC20Transfer(txData)) return;

      const transfer = txData.erc20Transfers[0];
      const walletData = await SupabaseService.getWalletByAddress(
        transfer.from
      );

      this.BUYBACK_PERCENTAGE = await this.getBuybackPercentage(transfer.from);

      if (!walletData) {
        console.log(
          "Ignoring transaction: wallet not being tracked:",
          transfer.from
        );
        return;
      }

      console.log("Detected sell from tracked wallet:", transfer.from);

      // Setup
      const client = await this.createWalletClient(walletData.private_key);
      const ethBalance = await client.getBalance({
        address: walletData.inhouse_wallet_address,
      });

      const sellAmount = this.calculateBuybackAmount(ethBalance, 18);
      const weth = this._getWethContract(client);
      const buyToken = this._getTokenContract(transfer.contract, client);

      // API Setup
      const headers = new Headers({
        "Content-Type": "application/json",
        "0x-api-key": config.ZERO_EX_API_KEY,
        "0x-version": "v2",
      });

      const priceParams = new URLSearchParams({
        chainId: client.chain.id.toString(),
        sellToken: weth.address,
        buyToken: getAddress(transfer.contract),
        sellAmount: sellAmount.toString(),
        taker: client.account.address,
      });

      // Get Price and Handle Approval
      const price = await this._getPriceQuote(priceParams, headers);
      await this._handleTokenApproval(weth, price, client);

      // Gas Check
      const estimatedGas = price.gas
        ? BigInt(price.gas) * BigInt(price.gasPrice)
        : 0n;
      if (estimatedGas > ethBalance) {
        console.log("Insufficient gas, skipping");
        return;
      }

      // Get Quote and Handle Permit2
      const quote = await this._getSwapQuote(priceParams, headers);
      console.log("Quote :", quote);
      let signature;
      if (quote.permit2?.eip712) {
        signature = await client.signTypedData(quote.permit2.eip712);
        quote.transaction.data = this._handlePermit2Signature(quote, signature);
      }

      // Execute Transaction
      if (quote.transaction.data) {
        const hash = await this._executeTransaction(quote, client);

        console.log(`Swap transaction hash: ${hash}`);
        console.log(`See tx details at https://basescan.org/tx/${hash}`);

        const receipt = await this._handleTransactionReceipt(hash, client);

        const sellTransfer = txData.erc20Transfers[0];
        const PRECISION_FACTOR = BigInt(10 ** 18);
        const tokenPriceInWeth =
          (BigInt(quote.sellAmount) * PRECISION_FACTOR) /
          BigInt(quote.buyAmount);

        if (hash) {
          await SupabaseService.addTransaction({
            wallet_address: sellTransfer.from,
            inhouse_wallet_address: walletData.inhouse_wallet_address,
            original_tx_hash: txData.erc20Transfers[0].transactionHash,
            buyback_tx_hash: hash,
            token_address: sellTransfer.contract,
            sell_amount: sellTransfer.value,
            buyback_amount: sellAmount.toString(),
            buyback_percentage: this.BUYBACK_PERCENTAGE,
            gas_used: receipt.gasUsed.toString(),
            gas_price: receipt.effectiveGasPrice.toString(),
            token_price_at_buyback_per_weth: tokenPriceInWeth.toString(),
          });
        }
        return hash;
      }
    } catch (error) {
      console.error("Error handling transaction:", error);
      return;
    }
  }
}

module.exports = new TokenBuybackService();
