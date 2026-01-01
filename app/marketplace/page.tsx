'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/hooks/useMarketplace';
import { connectWallet, formatAddress, formatSYS } from '@/lib/web3Config';

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price: string;
  stock: number;
  isActive: boolean;
}

export default function MarketplacePage() {
  const { getProductCount, getProduct } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'lana', 'algodón', 'seda', 'lino', 'otros'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const count = await getProductCount();
      const loadedProducts: Product[] = [];

      for (let i = 1; i <= count; i++) {
        try {
          const product = await getProduct(i);
          if (product.isActive) {
            loadedProducts.push(product);
          }
        } catch (err) {
          console.error(`Error loading product ${i}:`, err);
        }
      }

      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const wallet = await connectWallet();
      setWalletAddress(wallet.address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error conectando wallet. Asegúrate de tener MetaMask instalado.');
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              RampWool
            </span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/sell" className="text-gray-700 hover:text-purple-600">
              Vender
            </Link>
            <Link href="/rewards" className="text-gray-700 hover:text-purple-600">
              Recompensas
            </Link>
            {walletAddress ? (
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                {formatAddress(walletAddress)}
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Conectar Wallet
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace de Textiles</h1>
          <p className="text-gray-600">
            Explora productos textiles de alta calidad y gana recompensas RWOOL
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">
              No hay productos disponibles en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {product.price} SYS
                      </div>
                      <div className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/product/${product.id}`}
                    className="block w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center rounded-lg hover:shadow-lg transition-all"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
