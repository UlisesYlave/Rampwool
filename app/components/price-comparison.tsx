"use client"

import { ShoppingCart, ExternalLink } from "lucide-react"

interface PriceComparisonProps {
    productName: string;
}

export function PriceComparison({ productName }: PriceComparisonProps) {
    // In a real app, this would fetch from an API based on productName or SKU
    const comparisons = [
        {
            platform: "Temu",
            price: "$12.50",
            shipping: "Free (7-12 days)",
            logoColor: "bg-orange-500",
            url: "https://www.temu.com"
        },
        {
            platform: "MercadoLibre",
            price: "$14.20",
            shipping: "$2.50 (2-5 days)",
            logoColor: "bg-yellow-400 text-black",
            url: "https://www.mercadolibre.com"
        },
        {
            platform: "Aliexpress",
            price: "$9.99",
            shipping: "$4.00 (15-30 days)",
            logoColor: "bg-red-600",
            url: "https://www.aliexpress.com"
        }
    ]

    return (
        <div className="border-2 border-white/10 bg-zinc-900/50 overflow-hidden">
            <div className="px-6 py-5 flex items-center gap-3 border-b-2 border-primary/20 bg-black">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="font-black italic uppercase text-sm tracking-widest text-white">Price Comparison</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-black border-b-2 border-white/5">
                            {["Platform", "Price", "Shipping", "Action"].map((h) => (
                                <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold">
                        {comparisons.map((item, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-black transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${item.logoColor}`}>
                                        {item.platform.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-white font-black italic uppercase">{item.platform}</span>
                                </td>
                                <td className="px-6 py-4 text-white font-mono text-lg">{item.price}</td>
                                <td className="px-6 py-4 text-muted-foreground">{item.shipping}</td>
                                <td className="px-6 py-4">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-black border border-white/10 px-3 py-1.5 rounded transition-all"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-wider">Buy</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
