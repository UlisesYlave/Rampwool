import { ethers } from 'ethers';

// Configuración de redes Syscoin
export const SYSCOIN_NETWORKS = {
  mainnet: {
    chainId: 57,
    name: 'Syscoin Mainnet',
    rpcUrl: 'https://rpc.syscoin.org',
    blockExplorer: 'https://explorer.syscoin.org',
    nativeCurrency: {
      name: 'Syscoin',
      symbol: 'SYS',
      decimals: 18,
    },
  },
  tanenbaum: {
    chainId: 5700,
    name: 'Syscoin Tanenbaum Testnet',
    rpcUrl: 'https://rpc.tanenbaum.io',
    blockExplorer: 'https://tanenbaum.io',
    nativeCurrency: {
      name: 'Syscoin',
      symbol: 'tSYS',
      decimals: 18,
    },
  },
};

// Direcciones de contratos (actualizar después del deploy)
export const CONTRACT_ADDRESSES = {
  rewardToken: process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS || '',
  marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '',
  aggregator: process.env.NEXT_PUBLIC_AGGREGATOR_ADDRESS || '',
};

// Obtener provider de Syscoin
export const getSyscoinProvider = (network: 'mainnet' | 'tanenbaum' = 'tanenbaum') => {
  return new ethers.JsonRpcProvider(SYSCOIN_NETWORKS[network].rpcUrl);
};

// Obtener signer del usuario
export const getSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
  }
  throw new Error('No ethereum wallet detected');
};

// Conectar wallet del usuario
export const connectWallet = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      return {
        address,
        chainId: Number(network.chainId),
        provider,
        signer,
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  } else {
    throw new Error('Please install MetaMask or another Web3 wallet');
  }
};

// Cambiar a red Syscoin
export const switchToSyscoin = async (network: 'mainnet' | 'tanenbaum' = 'tanenbaum') => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const networkConfig = SYSCOIN_NETWORKS[network];
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkConfig.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Red no agregada, intentar agregarla
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${networkConfig.chainId.toString(16)}`,
                chainName: networkConfig.name,
                nativeCurrency: networkConfig.nativeCurrency,
                rpcUrls: [networkConfig.rpcUrl],
                blockExplorerUrls: [networkConfig.blockExplorer],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }
};

// Formatear dirección para mostrar
export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Formatear SYS para mostrar
export const formatSYS = (value: bigint | string, decimals: number = 4) => {
  const formatted = ethers.formatEther(value);
  return parseFloat(formatted).toFixed(decimals);
};

// Parsear SYS a Wei
export const parseSYS = (value: string) => {
  return ethers.parseEther(value);
};

// Declaración de tipos para window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
