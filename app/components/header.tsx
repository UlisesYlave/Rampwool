"use client"

import { Globe, Zap } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/context/LanguageContext"
import { useWallet } from "@/lib/context/WalletContext"
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
                                    <svg viewBox="0 0 40 40" fill="none"><path d="M35.9 3L22.2 13.2l2.5-6L35.9 3z" fill="#E2761B" /><path d="M4.1 3l13.6 10.3-2.4-6.1L4.1 3zm26.7 23.3l-3.6 5.5 7.7 2.1 2.2-7.5-6.3-.1zm-29.7.1l2.2 7.5 7.7-2.1-3.6-5.5-6.3.1z" fill="#E4761B" /><path d="M10.1 17.4l-2.2 3.3 7.7.3-.3-8.3-5.2 4.7zm19.8 0l-5.3-4.8-.2 8.4 7.7-.3-2.2-3.3z" fill="#E4761B" /><path d="M34.9 19.1l-7.1-2.1 2.2 3.3-3.2 6.2 4.2-.1h6.2l-2.3-7.3zM10.1 17l-7 2.1-2.4 7.3H7l4.2.1-3.2-6.2 2.1-3.3zm9.5 3.4l.5-7.9 2-5.6h-9.3l2 5.6.5 7.9.2 2.4v6.2h3.7l.1-6.2.3-2.4z" fill="#F6851B" /></svg>
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

