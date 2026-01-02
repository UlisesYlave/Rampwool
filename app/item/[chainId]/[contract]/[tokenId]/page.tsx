'use client';

import { useEffect, useState, use } from 'react';
import { ethers } from 'ethers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, ShieldCheck, Zap } from 'lucide-react';
import { useMarketplace } from '@/lib/hooks/useMarketplace';
import { getSyscoinProvider, SYSCOIN_NETWORKS, formatAddress } from '@/lib/web3Config';
import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { AttributesGrid, BlockchainDetails, ActivityLog, HowItWorks } from '@/app/components/nft-item-details-final';

// Minimal ABI for reading NFT data
const NFT_ABI = [
  'function name() view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
];

// Helper to fix IPFS URLs
const fixURI = (uri: string | null) => {
  if (!uri) return '';
  if (uri.startsWith('ipfs://')) return uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  return uri;
};

export default function ItemPage({ params }: { params: Promise<{ chainId: string; contract: string; tokenId: string }> }) {
  const resolvedParams = use(params);
  const { chainId, contract: contractAddress, tokenId } = resolvedParams;

  const [nft, setNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { buyNFT, loading: txLoading, error: txError } = useMarketplace();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data for:', chainId, contractAddress, tokenId);

        // --- REAL FETCH LOGIC (Commented out until deployment verified) ---
        /*
        let provider;
        if (chainId === '31337') {
             provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
        } else {
             const networkKey = chainId === '570' ? 'mainnet' : 'testnet';
             provider = getSyscoinProvider(networkKey);
        }
        const nftContract = new ethers.Contract(contractAddress, NFT_ABI, provider);
        const [name, owner, uri] = await Promise.all([
            nftContract.name().catch(() => 'Unknown Collection'),
            nftContract.ownerOf(tokenId),
            nftContract.tokenURI(tokenId).catch(() => '')
        ]);
        // ... fetch metadata ...
        */

        // --- MOCK DATA FOR DEMO/UI VERIFICATION ---
        // Simulating network delay
        await new Promise(r => setTimeout(r, 600));

        // Generate synthetic data based on ID to make it look dynamic
        const id = parseInt(tokenId) || 0;
        const mockCollections = ["CYBER NEON", "GENESIS", "RUNNER", "WARRIORS"];
        const mockImages = ["/neon-ape-nft.jpg", "/abstract-art-nft.png", "/void-walker-nft.jpg", "/cyberpunk-character-nft.jpg"];

        const mockData = {
          name: `Asset #${tokenId} - ${mockCollections[id % 4]}`,
          collection: mockCollections[id % 4],
          description: "A unique digital asset minted on the Rollux Layer 2 Network. Secured by Bitcoin merge-mining.",
          image: mockImages[id % 4],
          attributes: [
            { trait_type: "Background", value: "Cyber Dark" },
            { trait_type: "Rarity", value: "Legendary" },
            { trait_type: "Power", value: (Math.random() * 100).toFixed(0) }
          ],
          owner: "0x1234...5678",
          uri: ""
        };

        setNft(mockData);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading NFT');
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress && tokenId) {
      fetchData();
    }
  }, [chainId, contractAddress, tokenId]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-mono animate-pulse">LOADING NEURAL LINK...</div>;

  // This check prevents "Cannot read properties of null" on 'nft.collection'
  if (!nft || error) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono gap-4">
      <div>CONNECTION FAILURE</div>
      <div className="text-sm text-zinc-500">{error || 'Asset not found in the matrix.'}</div>
      <Link href="/" className="btn-cyber px-6 py-2 text-xs">RETURN</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-primary selection:text-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-12 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Market
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image & Tech Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-white/10 bg-zinc-900 aspect-square overflow-hidden group">
              <img
                src={nft.image || '/placeholder.svg'}
                className="w-full h-full object-cover "
                alt={nft.name}
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur border border-primary/20 px-3 py-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Rollux L2</span>
              </div>
            </div>

            <div className="space-y-8">
              <AttributesGrid attributes={nft.attributes} />
              <BlockchainDetails contractAddress={contractAddress} tokenId={tokenId} />
              <HowItWorks />
            </div>
          </div>

          {/* Right Column: Info & Action */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">
                  Collection: {nft.collection}
                </span>
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
                {nft.name}
              </h1>
              <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground pt-2">
                <span>Owned by</span>
                <span className="text-white font-mono bg-zinc-900 px-2 py-1 border border-white/10 rounded-sm">
                  {formatAddress(nft.owner)}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-primary/20 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-50"><Zap className="w-12 h-12 text-primary/10" /></div>

              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2 block">
                Current Price
              </span>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-black text-white">0.1</span>
                <span className="text-primary text-2xl font-black italic">SYS</span>
              </div>

              <button
                onClick={() => buyNFT(contractAddress, Number(tokenId), "0.1")}
                disabled={txLoading}
                className="btn-cyber w-full py-5 text-sm flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-black"
              >
                {txLoading ? 'PROCESSING TRANSACTION...' : 'BUY NOW'}
              </button>
              {txError && <p className="text-red-500 text-xs text-center mt-3 font-bold bg-red-900/10 p-2 border border-red-900/50">{txError}</p>}
            </div>

            {/* Activity */}
            <div className="p-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-white opacity-50">Item Activity</h4>
              <ActivityLog />
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
