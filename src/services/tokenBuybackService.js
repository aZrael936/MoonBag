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

class TokenBuybackService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
      "0x-api-key": config.ZERO_EX_API_KEY,
      "0x-version": "v2",
    };
  }

  async createWalletClient(privateKey) {
    const cleanPrivateKey = privateKey.replace("0x", "");
    if (cleanPrivateKey.length !== 64) {
      throw new Error(
        `Invalid private key length: ${cleanPrivateKey.length}. Expected 64 characters`
      );
    }
    return createWalletClient({
      account: privateKeyToAccount(`0x${cleanPrivateKey}`),
      chain: base,
      transport: http(config.RPC_URL),
    }).extend(publicActions);
  }

  async handleTransaction(txData) {
    try {
      if (!this.isERC20Transfer(txData)) {
        return;
      }

      const transfer = txData.erc20Transfers[0];
      const from = transfer.from;

      const walletData = await SupabaseService.getWalletByAddress(from);
      if (!walletData) {
        console.log("Ignoring transaction: wallet not being tracked:", from);
        return;
      }

      console.log("Detected sell from tracked wallet:", from);

      // Create wallet client for inhouse wallet
      console.log("Privatekey: ", walletData.private_key);
      const client = await this.createWalletClient(walletData.private_key);

      // Check WETH balance first
      const wethContract = getContract({
        address: config.WETH_ADDRESS,
        abi: erc20Abi,
        client,
      });

      const wethBalance = await wethContract.read.balanceOf([
        walletData.inhouse_wallet_address,
      ]);
      console.log("WETH Balance: ", wethBalance);

      if (wethBalance <= 0n) {
        console.log("No WETH balance in inhouse wallet, skipping swap");
        return;
      }

      // Check ETH for gas
      const ethBalance = await client.getBalance({
        address: walletData.inhouse_wallet_address,
      });

      if (ethBalance < parseUnits("0.0001", 18)) {
        console.log("Insufficient ETH for gas, skipping swap");
        return;
      }

      // If we have both WETH and ETH, proceed with swap
      const tokenAddress = getAddress(transfer.contract);
      const buyAmount = this.calculateBuybackAmount(
        BigInt(transfer.value),
        transfer.tokenDecimals
      );

      const header = {
        "Content-Type": "application/json",
        "0x-api-key": config.ZERO_EX_API_KEY,
        "0x-version": "v2",
      };
      console.log(
        "chainId: ",
        client.chain.id.toString(),
        "sellToken: ",
        config.WETH_ADDRESS,
        "buyToken: ",
        tokenAddress,
        "buyAmount: ",
        buyAmount.toString(),
        "taker: ",
        walletData.inhouse_wallet_address,
        "Header: ",
        header
      );

      // Get price quote from 0x
      const priceParams = new URLSearchParams({
        chainId: client.chain.id.toString(),
        sellToken: config.WETH_ADDRESS,
        buyToken: tokenAddress,
        buyAmount: buyAmount.toString(),
        taker: walletData.inhouse_wallet_address,
      });

      const priceResponse = await fetch(
        "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
        { headers: header }
      );
      const price = await priceResponse.json();
      console.log("PriceJSON: ", price);

      if (BigInt(price.buyAmount) > wethBalance) {
        console.log("Insufficient WETH for swap, skipping");
        return;
      }

      // Approve WETH spending if needed
      if (price.issues?.allowance !== null) {
        const { request } = await wethContract.simulate.approve([
          price.issues.allowance.spender,
          maxUint256,
        ]);

        const hash = await wethContract.write.approve(request.args);
        await client.waitForTransactionReceipt({ hash });
        console.log("Approved Permit2 to spend WETH");
      }

      // Get swap quote
      const quoteResponse = await fetch(
        "https://api.0x.org/swap/permit2/quote?" + priceParams.toString(),
        { headers: this.headers }
      );
      const quote = await quoteResponse.json();

      // Handle permit2 signature if needed
      let signature;
      if (quote.permit2?.eip712) {
        signature = await client.signTypedData(quote.permit2.eip712);

        if (signature && quote?.transaction?.data) {
          const signatureLengthInHex = numberToHex(size(signature), {
            signed: false,
            size: 32,
          });
          quote.transaction.data = concat([
            quote.transaction.data,
            signatureLengthInHex,
            signature,
          ]);
        }
      }

      // Execute swap
      if (signature && quote.transaction.data) {
        const nonce = await client.getTransactionCount({
          address: client.account.address,
        });

        const signedTransaction = await client.signTransaction({
          account: client.account,
          chain: client.chain,
          gas: quote?.transaction.gas
            ? BigInt(quote.transaction.gas)
            : undefined,
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

        const hash = await client.sendRawTransaction({
          serializedTransaction: signedTransaction,
        });

        console.log(`Swap transaction hash: ${hash}`);
        console.log(`See tx details at https://basescan.org/tx/${hash}`);

        return hash;
      }
    } catch (error) {
      console.error("Error handling transaction:", error);
      return;
    }
  }

  isERC20Transfer(txData) {
    return Boolean(txData?.erc20Transfers?.length > 0);
  }

  calculateBuybackAmount(value, decimals) {
    const buybackPercentage = 10; // 10%
    return (value * BigInt(buybackPercentage)) / BigInt(100);
  }
}

module.exports = new TokenBuybackService();
