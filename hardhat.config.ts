import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainType: "l1",
      chainId: 1337,
    },
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },
    // Syscoin Mainnet
    syscoin: {
      type: "http",
      chainType: "l1",
      url: "https://rpc.syscoin.org",
      chainId: 57,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Syscoin Tanenbaum Testnet (NEVM)
    tanenbaum: {
      type: "http",
      chainType: "l1",
      url: "https://rpc.tanenbaum.io",
      chainId: 5700,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
