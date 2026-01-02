import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, getSigner } from '../web3Config';

// ABI Real de NFTMarketplace.sol
const MARKETPLACE_ABI = [
  'function createListing(address nftContract, uint256 tokenId, uint256 price) external',
  'function buyNow(address nftContract, uint256 tokenId) external payable',
  'function cancelListing(address nftContract, uint256 tokenId) external',
  'function updateListing(address nftContract, uint256 tokenId, uint256 newPrice) external',
  'function createOrder(address nftContract, uint256 tokenId) external payable',
  'function acceptOrder(uint256 orderId) external',
  'function cancelOrder(uint256 orderId) external',
  'function getListing(address nftContract, uint256 tokenId) external view returns (tuple(address seller, uint256 price, uint256 createdAt, bool active))',
  'function getActiveOrders(address nftContract, uint256 tokenId) external view returns (tuple(uint256 orderId, address nftContract, uint256 tokenId, address buyer, uint256 price, uint256 createdAt, bool active)[])',
];

// ABI Mínimo para aprobar tokens ERC721
const ERC721_ABI = [
  'function approve(address to, uint256 tokenId) external',
  'function setApprovalForAll(address operator, bool approved) external',
  'function isApprovedForAll(address owner, address operator) external view returns (bool)',
  'function getApproved(uint256 tokenId) external view returns (address)',
];

export const useMarketplace = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        const signer = await getSigner();
        const marketplaceContract = new ethers.Contract(
          CONTRACT_ADDRESSES.marketplace,
          MARKETPLACE_ABI,
          signer
        );
        setContract(marketplaceContract);
      } catch (err) {
        console.error('Error initializing contract:', err);
      }
    };

    if (CONTRACT_ADDRESSES.marketplace) {
      initContract();
    }
  }, []);

  // Crear listado (Vender NFT)
  const listNFT = async (
    nftContractAddress: string,
    tokenId: number,
    price: string
  ) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    setError(null);

    try {
      const signer = await getSigner();
      const nftContract = new ethers.Contract(nftContractAddress, ERC721_ABI, signer);

      // Verificar aprobación
      const isApproved = await nftContract.isApprovedForAll(signer.address, CONTRACT_ADDRESSES.marketplace);
      if (!isApproved) {
        const approveTx = await nftContract.setApprovalForAll(CONTRACT_ADDRESSES.marketplace, true);
        await approveTx.wait();
      }

      const priceInWei = ethers.parseEther(price);
      const tx = await contract.createListing(nftContractAddress, tokenId, priceInWei);
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message || 'Error creating listing');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Comprar NFT
  const buyNFT = async (nftContractAddress: string, tokenId: number, price: string) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    setError(null);

    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await contract.buyNow(nftContractAddress, tokenId, {
        value: priceInWei,
      });
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message || 'Error buying NFT');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar listado
  const cancelListing = async (nftContractAddress: string, tokenId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    setLoading(true);
    try {
      const tx = await contract.cancelListing(nftContractAddress, tokenId);
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    loading,
    error,
    listNFT,
    buyNFT,
    cancelListing,
  };
};
