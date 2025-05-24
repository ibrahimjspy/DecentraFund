import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const NETWORKS = {
  mainnet: 1,
  sepolia: 11155111,
  goerli: 5,
};

const CHAIN_PARAMS = {
  mainnet: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://etherscan.io'],
  },
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Testnet',
    rpcUrls: ['https://rpc.sepolia.org'],
    nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  goerli: {
    chainId: '0x5',
    chainName: 'Goerli Testnet',
    rpcUrls: ['https://ethereum-goerli.publicnode.com'],
    nativeCurrency: { name: 'GoerliETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
};

const WalletContext = createContext({
  provider: null,
  address: null,
  network: 'mainnet',
  connect: async () => {},
  switchNetwork: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState('mainnet');

    const connect = async () => {
      console.log('Connecting to wallet...');
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const addr = await signer.getAddress();
      setProvider(browserProvider);
      setAddress(addr);
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  const switchNetwork = async (selected) => {
    if (!window.ethereum) return;

    const hexChainId = '0x' + NETWORKS[selected].toString(16);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
      setNetwork(selected);
      await connect();
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CHAIN_PARAMS[selected]],
          });
          setNetwork(selected);
          await connect();
        } catch (addErr) {
          alert('Failed to add network: ' + addErr.message);
        }
      } else {
        alert('Network switch failed: ' + err.message);
      }
    }
  };

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      connect();
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ provider, address, network, connect, switchNetwork }}
    >
      {children}
    </WalletContext.Provider>
  );
};
