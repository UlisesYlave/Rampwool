'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { connectWallet, switchToSyscoin, SYSCOIN_NETWORKS } from '../web3Config';

interface Web3ContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const isConnected = !!address;
  const isCorrectNetwork = chainId === SYSCOIN_NETWORKS.testnet.chainId ||
    chainId === SYSCOIN_NETWORKS.mainnet.chainId;

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();

            setAddress(address);
            setChainId(Number(network.chainId));
            setProvider(provider);
            setSigner(signer);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        // Reload page to reset state
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connect = async () => {
    try {
      const wallet = await connectWallet();
      setAddress(wallet.address);
      setChainId(wallet.chainId);
      setProvider(wallet.provider);
      setSigner(wallet.signer);

      // Switch to Syscoin if not already
      if (wallet.chainId !== SYSCOIN_NETWORKS.testnet.chainId &&
        wallet.chainId !== SYSCOIN_NETWORKS.mainnet.chainId) {
        await switchNetwork();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
  };

  const switchNetwork = async () => {
    try {
      // Switch to testnet by default
      await switchToSyscoin('testnet');
      // After switching, update chain ID
      if (provider) {
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
      }
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  const value: Web3ContextType = {
    address,
    chainId,
    isConnected,
    isCorrectNetwork,
    provider,
    signer,
    connect,
    disconnect,
    switchNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}