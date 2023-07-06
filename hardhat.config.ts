import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import dotenv from 'dotenv';
import 'hardhat-contract-sizer';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10,
          },
        }
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        }
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`!,
      chainId: 1,
      accounts: [process.env.PRIVATE_KEY1!, process.env.PRIVATE_KEY2!]
    },
    munbai: {
      url: `https://polygon-testnet.public.blastapi.io`!,
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY1!, process.env.PRIVATE_KEY2!],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`!,
      chainId: 5,
      accounts: [process.env.PRIVATE_KEY1!, process.env.PRIVATE_KEY2!],      
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`!,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY1!, process.env.PRIVATE_KEY2!],      
      gasPrice: 10000000000,
      timeout:10000
    },
     astar: {
      url: `https://astar.api.onfinality.io/public`!,
      chainId: 592,
      accounts: [process.env.PRIVATE_KEY1!, process.env.PRIVATE_KEY2!],    
      gasPrice: 20000000000,  
      gas: 5000000,
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  },
  etherscan: {
    apiKey: {
      goerli: process.env.API_ETH!,
      sepolia: process.env.API_ETH!,
      polygonMumbai: process.env.API_POLYGON!,
    }
  }
};

export default config;
