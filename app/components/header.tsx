"use client"

import { Globe, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/context/LanguageContext"
import { useWallet } from "@/lib/context/WalletContext"

export function Header() {
    const pathname = usePathname()
    const { t, language, toggleLanguage } = useLanguage()
    const { isConnected, connectWallet, address, disconnectWallet, currentBalance } = useWallet()

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true
        if (path !== "/" && pathname.startsWith(path)) return true
        return false
    }

    const getLinkClass = (path: string) => {
        return isActive(path)
            ? "text-primary underline underline-offset-8 decoration-2"
            : "text-zinc-400 hover:text-primary transition-colors"
    }

    return (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center text-black font-black text-xl italic skew-x-[-12deg]">
                            RW
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-black tracking-tighter leading-none text-white">RAMPWOOL</h1>
                            <p className="text-[9px] font-bold text-primary tracking-[0.2em] uppercase">NFT Marketplace</p>
                        </div>
                    </Link>
                </div>

                <nav className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
                    <Link href="/" className={getLinkClass("/")}>
                        {t('explore')}
                    </Link>
                    <Link href="/marketplace" className={getLinkClass("/marketplace")}>
                        {t('marketplace')}
                    </Link>
                    <Link href="/collections" className={getLinkClass("/collections")}>
                        {t('collections')}
                    </Link>
                    <Link href="/stats" className={getLinkClass("/stats")}>
                        {t('stats')}
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/10 px-4 py-2 hover:bg-white/5 text-white"
                    >
                        <Globe className="w-3 h-3" />
                        {language.toUpperCase()}
                    </button>

                    {isConnected ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <div className="text-[10px] font-bold text-primary">{currentBalance} SYS</div>
                                <div className="text-[9px] font-mono text-zinc-500">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
                            </div>
                            <button
                                onClick={disconnectWallet}
                                className="btn-cyber text-[11px] bg-zinc-900 border-zinc-700 hover:border-red-500 hover:text-red-500"
                            >
                                <Zap className="w-4 h-4 fill-current" />
                                {t('disconnect')}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => connectWallet()}
                            className="btn-cyber text-[11px]"
                        >
                            <Zap className="w-4 h-4 fill-current" />
                            {t('connectWallet')}
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}

