"use client"

import { NFTCard } from "@/app/components/nft-card"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { useLanguage } from "@/lib/context/LanguageContext"

// Mock Data with Links
// In a real app, this would come from a graph indexer or contract event log
// We use a dummy address for the demo: 0xDemo...
const DEMO_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Localhost default or similar

export default function Marketplace() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary selection:text-black">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10 border-b border-white/5 relative overflow-hidden">
        {/* Background Band with Lana Artesanal */}
        <div className="absolute top-0 right-0 w-1/3 h-full -skew-x-12 transform translate-x-1/2 overflow-hidden opacity-50">
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
          <img src="/lana_artesanal.jpeg" alt="" className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1">
              <span className="w-2 h-2 bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                {t('liveOnRollux')}
              </span>
            </div>
            <h2 className="text-7xl md:text-8xl font-black italic tracking-tighter leading-[0.8] mb-8">
              <span className="text-primary">{t('globalFashion')} </span>  {t('localPrices')}
            </h2>
            <p className="text-muted-foreground text-xl font-medium max-w-lg mb-10 leading-relaxed">
              {t('heroDescription')}
            </p>
            <div className="flex gap-4">
              <button className="btn-cyber px-10 py-5 text-sm">{t('explore')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <NFTCard
            name="Premium Alpaca Wool"
            collection="ANDES SERIES"
            price="45.00"
            image="/fabric-wool.jpg"
            owner="0x71...f2e"
            isVerified
            href={`/item/57/${DEMO_CONTRACT}/1`}
          />
          <NFTCard
            name="Luxury Mulberry Silk"
            collection="ORIENTAL LUXE"
            price="120.00"
            image="/fabric-silk.jpg"
            owner="0xabc...123"
            href={`/item/57/${DEMO_CONTRACT}/2`}
          />
          <NFTCard
            name="Organic Pima Cotton"
            collection="PERUVIAN ESSENTIALS"
            price="18.50"
            image="/fabric-cotton.jpg"
            owner="0x123...456"
            href={`/item/57/${DEMO_CONTRACT}/3`}
          />
          <NFTCard
            name="Heavy Duty Canvas"
            collection="WORKWEAR"
            price="22.00"
            image="/fabric-canvas.jpg"
            owner="0x999...888"
            href={`/item/57/${DEMO_CONTRACT}/4`}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}
