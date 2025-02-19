import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import {configDotenv} from "dotenv";

configDotenv()

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  etherscan: {
    apiKey: {
      holesky: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : "",
      bscTestnet: process.env.BSCSCAN_API_KEY ? process.env.BSCSCAN_API_KEY : "",
    },
  },
  sourcify: {
    enabled: true
  },
  networks: {
    holesky: {
      url: process.env.HOLESKY_URL ? process.env.HOLESKY_URL : "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    bscTestnet: {
      url: process.env.BSC_TESTNET_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 97,
    },
  },
};

export default config;
