import { Globe } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/5 py-20 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-black font-black text-sm italic">
                                RW
                            </div>
                            <h4 className="text-lg font-black tracking-tighter">RAMPWOOL</h4>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-8">
                            Building the infrastructure for the next generation of digital commerce on Syscoin and Rollux networks.
                        </p>
                        <div className="flex gap-4">
                            <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                <Globe className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Marketplace</h5>
                        <ul className="flex flex-col gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <li>
                                <Link href="/marketplace" className="hover:text-white">
                                    All NFTs
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Collections
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Stats
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Company</h5>
                        <ul className="flex flex-col gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <li>
                                <a href="#" className="hover:text-white">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        © 2026 RampWool. All Rights Reserved.
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
