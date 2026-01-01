import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, getSigner } from '../web3Config';

// ABIs simplificados - actualizar con ABIs completos después de compilar
const MARKETPLACE_ABI = [
  'function listProduct(string memory _name, string memory _description, string memory _imageUrl, string memory _category, uint256 _price, uint256 _stock) external returns (uint256)',
  'function purchaseProduct(uint256 _productId, uint256 _quantity) external payable',
  'function getProduct(uint256 _productId) external view returns (tuple(uint256 id, address seller, string name, string description, string imageUrl, string category, uint256 price, uint256 stock, bool isActive, uint256 createdAt))',
  'function productCounter() external view returns (uint256)',
  'function verifiedSellers(address) external view returns (bool)',
  'event ProductListed(uint256 indexed productId, address indexed seller, string name, uint256 price, uint256 stock)',
  'event ProductPurchased(uint256 indexed purchaseId, uint256 indexed productId, address indexed buyer, uint256 quantity, uint256 totalPrice)',
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

  const listProduct = async (
    name: string,
    description: string,
    imageUrl: string,
    category: string,
    price: string,
    stock: number
  ) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    setError(null);
    
    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await contract.listProduct(
        name,
        description,
        imageUrl,
        category,
        priceInWei,
        stock
      );
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchaseProduct = async (productId: number, quantity: number, totalPrice: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    setError(null);
    
    try {
      const priceInWei = ethers.parseEther(totalPrice);
      const tx = await contract.purchaseProduct(productId, quantity, {
        value: priceInWei,
      });
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (productId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const product = await contract.getProduct(productId);
      return {
        id: Number(product.id),
        seller: product.seller,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        price: ethers.formatEther(product.price),
        stock: Number(product.stock),
        isActive: product.isActive,
        createdAt: Number(product.createdAt),
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getProductCount = async () => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const count = await contract.productCounter();
      return Number(count);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const isVerifiedSeller = async (address: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      return await contract.verifiedSellers(address);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    contract,
    loading,
    error,
    listProduct,
    purchaseProduct,
    getProduct,
    getProductCount,
    isVerifiedSeller,
  };
};
