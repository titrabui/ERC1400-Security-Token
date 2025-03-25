require("dotenv").config();

import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import "hardhat-erc1820";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: { count: 20 },
      allowUnlimitedContractSize: false,
    },
    cvc_testnet: {
      url: process.env.NETWORK_RPC,
      accounts: process.env.DEPLOY_PRIVATE_KEY ? [process.env.DEPLOY_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHER_API_KEY ?? "",
      bsc: process.env.BINANCE_API_KEY ?? "",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    token: "ETH",
    coinmarketcap: process.env.COIN_MARKET_CAP_API_KEY ?? "",
    gasPriceApi: process.env.GAS_PRICE_API_KEY ?? "",
    enabled: !!process.env.REPORT_GAS,
  },
};

module.exports = config;
