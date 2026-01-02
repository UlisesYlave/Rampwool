"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { SYSCOIN_NETWORKS } from '@/lib/web3Config';
import { useLanguage } from './LanguageContext';

interface NetworkConfig {
    chainId: number;
    name: string;
    icon?: string;
    rpcUrl: string;
    blockExplorer: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}

interface WalletContextType {
    address: string | null;
    signer: JsonRpcSigner | null;
    provider: BrowserProvider | null;
    isConnected: boolean;
    chainId: number | null;
    currentBalance: string;
    connectWallet: (type: 'metamask' | '0xaddress') => Promise<void>;
    disconnectWallet: () => void;
    switchNetwork: (chainId: number) => Promise<void>;
    isVerified: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Extend window interface for ethereum and oxaddress
declare global {
    interface Window {
        ethereum?: any;
        oxaddress?: any;
    }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [currentBalance, setCurrentBalance] = useState<string>('0');
    const [isVerified, setIsVerified] = useState<boolean>(false);

    // We can use the language context to get translations if needed for toasts (though ideally toasts should be handled by a UI component listening to errors)
    const { t } = useLanguage();

    // Helper: Get MetaMask provider
    const getMetaMask = () => {
        if (typeof window !== 'undefined' && window.ethereum?.isMetaMask && !window.ethereum?.isOxAddress) {
            return window.ethereum;
        }
        return null;
    };

    // Helper: Get 0xAddress provider
    const get0xAddress = () => {
        if (typeof window === 'undefined') return null;
        if (window.oxaddress) return window.oxaddress;
        if (window.ethereum?.isOxAddress) return window.ethereum;
        return null;
    };

    const updateBalance = useCallback(async (addr: string, prov: any) => {
        try {
            const bal = await prov.getBalance(addr);
            setCurrentBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
        } catch (e) {
            console.error("Error fetching balance:", e);
        }
    }, []);

    // Verify signature
    const verifySignature = async (currentSigner: JsonRpcSigner, currentAddress: string) => {
        try {
            const message = `Sign to verify ownership of ${currentAddress}\n\nTimestamp: ${Date.now()}`;
            const signature = await currentSigner.signMessage(message);
            const recoveredAddress = ethers.verifyMessage(message, signature);

            if (recoveredAddress.toLowerCase() === currentAddress.toLowerCase()) {
                setIsVerified(true);
                console.log('[verifySignature] Verified!');
                return true;
            }
        } catch (e: any) {
            console.log('[verifySignature] User declined:', e.message);
            setIsVerified(false);
            return false;
        }
    };

    const connectWallet = async (type: 'metamask' | '0xaddress') => {
        console.log('[connectWallet] Type:', type);

        const wp = type === 'metamask' ? getMetaMask() : get0xAddress();
        if (!wp) {
            alert(t('notInstalled')); // Using alert for now, should replace with toast
            return;
        }

        try {
            const accounts = await wp.request({ method: 'eth_requestAccounts' });
            console.log('[connectWallet] Accounts:', accounts);

            let accountAddress = accounts[0];

            // Handle array or object returns
            if (typeof accountAddress !== 'string' && accountAddress?.address) {
                accountAddress = accountAddress.address;
            }

            if (!accountAddress) {
                throw new Error('No address found');
            }

            const newProvider = new ethers.BrowserProvider(wp);
            const newSigner = await newProvider.getSigner();

            setAddress(accountAddress);
            setProvider(newProvider);
            setSigner(newSigner);

            const network = await newProvider.getNetwork();
            const newChainId = Number(network.chainId);
            setChainId(newChainId);

            await updateBalance(accountAddress, newProvider);

            // Setup listeners
            if (wp.on) {
                wp.on('accountsChanged', async (accs: any[]) => {
                    if (accs.length > 0) {
                        const newAddr = accs[0]?.address || accs[0];
                        setAddress(newAddr);
                        setIsVerified(false);
                        const p = new ethers.BrowserProvider(wp);
                        setProvider(p);
                        const s = await p.getSigner();
                        setSigner(s);
                        await updateBalance(newAddr, p);
                    } else {
                        disconnectWallet();
                    }
                });
                wp.on('chainChanged', async (newChainIdHex: string) => {
                    const cid = parseInt(newChainIdHex, 16);
                    setChainId(cid);
                    const p = new ethers.BrowserProvider(wp);
                    setProvider(p);
                    const s = await p.getSigner();
                    setSigner(s);
                    if (address) await updateBalance(address, p);
                });
            }

            // Verify signature after connection
            await verifySignature(newSigner, accountAddress);

        } catch (e: any) {
            console.error('[connectWallet] Error:', e);
            if (e.code === 4001) {
                alert(t('signFailed'));
            } else {
                alert(e.message || 'Error connecting wallet');
            }
        }
    };

    const disconnectWallet = () => {
        setAddress(null);
        setSigner(null);
        setProvider(null);
        setChainId(null);
        setCurrentBalance('0');
        setIsVerified(false);
    };

    const switchNetwork = async (targetChainId: number) => {
        if (!provider) return;

        // Find network config
        const targetNetwork = Object.values(SYSCOIN_NETWORKS).find(n => n.chainId === targetChainId);

        try {
            const hexChainId = '0x' + targetChainId.toString(16);

            try {
                // @ts-ignore
                await provider.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: hexChainId }]
                });
            } catch (switchError: any) {
                if (switchError.code === 4902 && targetNetwork) {
                    // @ts-ignore
                    await provider.provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: hexChainId,
                            chainName: targetNetwork.name,
                            nativeCurrency: targetNetwork.nativeCurrency,
                            rpcUrls: [targetNetwork.rpcUrl],
                            blockExplorerUrls: targetNetwork.blockExplorer ? [targetNetwork.blockExplorer] : []
                        }]
                    });
                } else {
                    throw switchError;
                }
            }
        } catch (e) {
            console.error("Failed to switch network", e);
        }
    };

    return (
        <WalletContext.Provider value={{
            address,
            signer,
            provider,
            isConnected: !!address,
            chainId,
            currentBalance,
            connectWallet,
            disconnectWallet,
            switchNetwork,
            isVerified
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