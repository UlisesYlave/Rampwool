"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { getSyscoinProvider } from '@/lib/web3Config';

interface WalletContextType {
    address: string | null;
    signer: JsonRpcSigner | null;
    provider: BrowserProvider | null;
    isConnected: boolean;
    chainId: number | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    currentBalance: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [currentBalance, setCurrentBalance] = useState<string>('0');

    // Helper to get MetaMask
    const getMetaMask = () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            return window.ethereum;
        }
        return null;
    };

    const updateBalance = async (addr: string, prov: any) => {
        try {
            const bal = await prov.getBalance(addr);
            setCurrentBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
        } catch (e) {
            console.error("Error fetching balance:", e);
        }
    };

    const connectWallet = async () => {
        const ethereum = getMetaMask();
        if (!ethereum) {
            alert("MetaMask not installed!");
            return;
        }

        try {
            const browserProvider = new ethers.BrowserProvider(ethereum);
            const accounts = await browserProvider.send("eth_requestAccounts", []);

            if (accounts.length > 0) {
                const _signer = await browserProvider.getSigner();
                const network = await browserProvider.getNetwork();

                setProvider(browserProvider);
                setSigner(_signer);
                setAddress(accounts[0]);
                setChainId(Number(network.chainId));

                await updateBalance(accounts[0], browserProvider);
            }
        } catch (error) {
            console.error("Connection failed:", error);
        }
    };

    const disconnectWallet = () => {
        setAddress(null);
        setSigner(null);
        setProvider(null);
        setChainId(null);
        setCurrentBalance('0');
    };

    // Listen for account changes
    useEffect(() => {
        const ethereum = getMetaMask();
        if (ethereum) {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                    if (provider) updateBalance(accounts[0], provider);
                } else {
                    disconnectWallet();
                }
            };

            const handleChainChanged = (chainIdHex: string) => {
                const newChainId = parseInt(chainIdHex, 16);
                setChainId(newChainId);
                // Reloading page is recommended by MetaMask on chain change, 
                // but we can just re-instantiate provider if we want SPA feel
                window.location.reload();
            };

            // Modern providers support .on
            if (ethereum.on) {
                ethereum.on('accountsChanged', handleAccountsChanged);
                ethereum.on('chainChanged', handleChainChanged);
            }

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    ethereum.removeListener('chainChanged', handleChainChanged);
                }
            };
        }
    }, [provider]);

    return (
        <WalletContext.Provider value={{
            address,
            signer,
            provider,
            isConnected: !!address,
            chainId,
            connectWallet,
            disconnectWallet,
            currentBalance
        }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
