"use client"

import { Search, LayoutGrid } from "lucide-react"
import { NFTCard } from "@/app/components/nft-card"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { useLanguage } from "@/lib/context/LanguageContext";

// Mock NFT data for demo (will be replaced with contract data when deployed)
const DEMO_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const mockFabrics = [
  {
    id: 1,
    name: "Royal Silk Chiffon",
    collection: "NATURAL SILK",
    price: "1250",
    image: "/fabric-silk.jpg",
    owner: "SilkRoad Traders",
    isVerified: true,
    href: `/item/57/${DEMO_CONTRACT}/1`
  },
  {
    id: 2,
    name: "Heavy Duty Canvas",
    collection: "INDUSTRIAL",
    price: "85",
    image: "/fabric-canvas.jpg",
    owner: "TextilePro",
    isVerified: false,
    href: `/item/57/${DEMO_CONTRACT}/2`
  },
  {
    id: 3,
    name: "Organic Cotton Print",
    collection: "SUSTAINABLE",
    price: "42",
    image: "/fabric-cotton.jpg",
    owner: "GreenWeave",
    isVerified: true,
    href: `/item/57/${DEMO_CONTRACT}/3`
  },
  {
    id: 4,
    name: "Luxury Velvet Red",
    collection: "PREMIUM",
    price: "520",
    image: "/fabric-velvet.jpg",
    owner: "RoyalFabrics",
    isVerified: false,
    href: `/item/57/${DEMO_CONTRACT}/4`
  },
  {
    id: 5,
    name: "Technical Nylon",
    collection: "SPORTSWEAR",
    price: "87",
    image: "/fabric-nylon.jpg",
    owner: "TechTex",
    isVerified: true,
    href: `/item/57/${DEMO_CONTRACT}/5`
  },
  {
    id: 6,
    name: "Wool Blend Tartan",
    collection: "WINTER",
    price: "150",
    image: "/fabric-wool.jpg",
    owner: "HighlandMills",
    isVerified: true,
    href: `/item/57/${DEMO_CONTRACT}/6`
  },
]

export default function MarketplacePage() {

  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1">
        {/* Page Title */}
        <section className="container mx-auto px-5 py-4 border-b border-white/5">
          <h1 className="text-5xl md:text-5xl font-black italic tracking-tighter mb-4">
            {t('explore').toUpperCase()} <span className="text-primary">FABRICS</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse all premium fabrics available on the RampWool marketplace. Buy directly from manufacturers with crypto.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <section className="bg-zinc-950 border-b border-white/5 py-8 sticky top-20 z-40 backdrop-blur-md">
          <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/3 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="SEARCH FABRICS, MATERIALS, ORIGIN..."
                className="input-cyber pl-12"
              />
            </div>
            <div className="flex gap-4">
              <button className="bg-secondary border border-border px-6 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:border-primary transition-colors">
                <LayoutGrid className="w-4 h-4" /> FILTERS
              </button>
              <select className="bg-secondary border border-border px-6 font-black text-[10px] uppercase tracking-widest outline-none focus:border-primary">
                <option>NEWEST FIRST</option>
                <option>PRICE: LOW TO HIGH</option>
                <option>PRICE: HIGH TO LOW</option>
                <option>MOST POPULAR</option>
              </select>
            </div>
          </div>
        </section>

        {/* NFT Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockFabrics.map((nft) => (
              <NFTCard
                key={nft.id}
                name={nft.name}
                collection={nft.collection}
                price={nft.price}
                image={nft.image}
                owner={nft.owner}
                isVerified={nft.isVerified}
                href={nft.href}
              />
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button className="border border-white/10 px-12 py-5 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
              LOAD MORE ASSETS
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-12 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-primary mb-2">1,234</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Fabrics</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white mb-2">567</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Suppliers</div>
            </div>
            <div>
              <div className="text-4xl font-black text-primary mb-2">89K</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Volume (SYS)</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white mb-2">2.5%</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Platform Fee</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
