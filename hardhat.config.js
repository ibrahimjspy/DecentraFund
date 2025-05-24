require('@nomicfoundation/hardhat-ethers');
module.exports = {
  solidity: '0.8.20',
  networks: {
    anvil: {
      url: 'http://127.0.0.1:8545',
      // Use anvil account private key here:
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ],
    },
    // or use "localhost" for Hardhat Network
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
};
