import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated" as const,
      chainType: "l1" as const,
      chainId: 1337,
    },
    localhost: {
      type: "http" as const,
      chainType: "l1" as const,
      url: "http://127.0.0.1:8545",
    },
    // Syscoin Mainnet
    syscoin: {
      type: "http" as const,
      chainType: "l1" as const,
      url: "https://rpc.syscoin.org",
      chainId: 57,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Syscoin Tanenbaum Testnet (NEVM)
    tanenbaum: {
      type: "http" as const,
      chainType: "l1" as const,
      url: "https://rpc.tanenbaum.io",
      chainId: 5700,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
