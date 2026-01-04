"use client"

import { Globe, Moon, Sun, Zap } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/context/LanguageContext"
import { useWallet } from "@/lib/context/WalletContext"
import { useTheme } from "@/lib/context/ThemeContext"
import "./header.css"

export function Header() {
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

    function openModal() {
        setIsWalletModalOpen(true)
    }

    function closeModal() {
        setIsWalletModalOpen(false)
    }

    const pathname = usePathname()
    const { t, language, toggleLanguage } = useLanguage()
    const { isConnected, connectWallet, address, disconnectWallet, currentBalance } = useWallet()
    const { theme, toggleTheme } = useTheme()

    const isActive = (path: string) => {
        if (!pathname) return false
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
                    <Link href="/plans" className={getLinkClass("/plans")}>
                        {t('plans')}
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

                    <button
                        onClick={toggleTheme}
                        className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/10 px-4 py-2 hover:bg-white/5 text-white"
                    >
                        {theme === 'dark' ? <Sun /> : <Moon />}
                    </button>

                    {isConnected ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <div className="text-[12px] font-bold text-primary">{currentBalance} SYS</div>
                                <div className="text-[11px] font-mono text-zinc-500">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
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
                            onClick={openModal}
                            className="btn-cyber text-[11px]"
                        >
                            <Zap className="w-4 h-4 fill-current" />
                            {t('connectWallet')}
                        </button>
                    )}
                </div>
            </div>

            {/* Wallet Modal */}
            <div className={`modal-overlay ${isWalletModalOpen ? 'visible' : ''}`} id="walletModal">
                <div className="modal">
                    <div className="modal-header">
                        <div className="modal-title" data-i18n="selectWallet">Select Wallet</div>
                        <button className="modal-close" onClick={closeModal}>✕</button>
                    </div>
                    <div className="modal-body">
                        <p className="modal-subtitle" data-i18n="chooseWallet">Choose how you want to connect</p>
                        <div className="wallet-options">
                            <button className="wallet-option" id="metamaskOption" onClick={() => connectWallet('metamask')}>
                                <div className="wallet-option-icon">
                                    <img src="data:image/png;base64,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" alt="metamask-logo" />
                                </div>
                                <div className="wallet-option-info">
                                    <div className="wallet-option-name">MetaMask</div>
                                    <div className="wallet-option-status" id="metamaskStatus">Checking...</div>
                                </div>
                                <div className="wallet-option-arrow">→</div>
                            </button>
                            <button className="wallet-option" id="oxaddressOption" onClick={() => connectWallet('0xaddress')}>
                                <div className="wallet-option-icon">
                                    <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="url(#g1)" stroke="#a855f7" stroke-width="2" /><text x="20" y="25" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">0x</text><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7c5cff" /><stop offset="100%" stop-color="#a855f7" /></linearGradient></defs></svg>
                                </div>
                                <div className="wallet-option-info">
                                    <div className="wallet-option-name">0xAddress</div>
                                    <div className="wallet-option-status" id="oxaddressStatus">Checking...</div>
                                </div>
                                <div className="wallet-option-arrow">→</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

