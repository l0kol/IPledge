require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20", // For OpenZeppelin contracts
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.8.26", // For Story Protocol contracts
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.8.28", // For our contract (Idea.sol)
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
    // Add overrides for Story Protocol's exact versions
    overrides: {
      "lib/protocol-core-v1/**/*.sol": {
        version: "0.8.26",
        settings: {},
      },
      "lib/protocol-periphery-v1/**/*.sol": {
        version: "0.8.26",
        settings: {},
      },
    },
  },
  paths: {
    // Map import paths to your cloned repos
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
    libraries: "./lib", // Tell Hardhat to look in ./lib
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://lingering-winter-spree.story-mainnet.quiknode.pro/${process.env.QUICKNODE_API_KEY}`,
      },
    },
    // Add other networks as needed
  },
};
