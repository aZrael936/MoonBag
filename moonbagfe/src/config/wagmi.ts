import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    appName: "Moonbag",
    chains: [base],
    transports: {
      [base.id]: http(
        "https://base-mainnet.g.alchemy.com/v2/txntl9XYKWyIkkmj1p0JcecUKxqt9327"
      ),
    },
    walletConnectProjectId: "b1647c589ac18a28722c490d2f840895",
  })
);
