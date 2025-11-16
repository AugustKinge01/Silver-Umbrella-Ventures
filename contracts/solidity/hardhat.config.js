require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // OneChain Testnet
    onechainTestnet: {
      url: process.env.ONECHAIN_TESTNET_RPC || "https://testnet-rpc.onechain.network",
      chainId: 1001,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
    // OneChain Mainnet
    onechainMainnet: {
      url: process.env.ONECHAIN_MAINNET_RPC || "https://rpc.onechain.network",
      chainId: 1000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
    // Localhost for testing
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  paths: {
    sources: "./contracts/solidity",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      onechain: process.env.ONECHAIN_EXPLORER_API_KEY || "",
    },
  },
};
