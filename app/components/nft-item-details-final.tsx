import { Tag, Database, History, HelpCircle, ExternalLink } from "lucide-react"

// Componente para Atributos
export function AttributesGrid({ attributes }: { attributes: any[] }) {
    if (!attributes || attributes.length === 0) return null
    return (
        <div className="border-2 border-white/10 bg-zinc-900/50 overflow-hidden">
            <div className="px-6 py-5 flex items-center gap-3 border-b-2 border-primary/20 bg-black">
                <Tag className="w-5 h-5 text-primary" />
                <h3 className="font-black italic uppercase text-sm tracking-widest text-white">Attributes</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
                {attributes.map((attr, i) => (
                    <div
                        key={i}
                        className="flex flex-col p-5 bg-black border-2 border-white/5 relative overflow-hidden group hover:border-primary/30"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -mr-8 -mt-8 rotate-45 group-hover:bg-primary/10 transition-colors"></div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{attr.trait_type}</span>
                        <span className="text-lg font-black text-white uppercase italic">{attr.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Componente para Blockchain Details
export function BlockchainDetails({
    contractAddress,
    tokenId,
    standard = "ERC-721",
    network = "Rollux L2"
}: {
    contractAddress: string
    tokenId: string
    standard?: string
    network?: string
}) {
    const details = [
        { label: "Contract Address", value: contractAddress || "Unknown", isLink: true },
        { label: "Token ID", value: tokenId || "Unknown", isLink: false },
        { label: "Token Standard", value: standard, isLink: false },
        { label: "Network", value: network, isLink: false },
        { label: "Metadata Storage", value: "IPFS", isLink: true },
    ]

    return (
        <div className="border-2 border-white/10 bg-zinc-900/50 overflow-hidden">
            <div className="px-6 py-5 flex items-center gap-3 border-b-2 border-primary/20 bg-black">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="font-black italic uppercase text-sm tracking-widest text-white">Blockchain Info</h3>
            </div>
            <div className="p-6 space-y-5">
                {details.map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 text-xs">
                        <span className="font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
                        <span
                            className={`font-mono font-bold ${item.isLink ? "text-primary flex items-center gap-2 hover:underline cursor-pointer" : "text-white"}`}
                        >
                            {item.value.length > 20 ? item.value.substring(0, 6) + "..." + item.value.substring(item.value.length - 4) : item.value}
                            {item.isLink && <ExternalLink className="w-3 h-3" />}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Componente para Activity
export function ActivityLog() {
    const activities = [
        { event: "Sale", price: "420 SYS", from: "0xabc", to: "0xdef", date: "2d ago" },
        { event: "Transfer", price: "-", from: "0x789", to: "0xabc", date: "5d ago" },
        { event: "Mint", price: "-", from: "Null", to: "0x789", date: "1w ago" },
    ]

    return (
        <div className="border-2 border-white/10 bg-zinc-900/50 overflow-hidden">
            <div className="px-6 py-5 flex items-center gap-3 border-b-2 border-primary/20 bg-black">
                <History className="w-5 h-5 text-primary" />
                <h3 className="font-black italic uppercase text-sm tracking-widest text-white">Activity History</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-black border-b-2 border-white/5">
                            {["Event", "Price", "From", "To", "Date"].map((h) => (
                                <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold">
                        {activities.map((row, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-black transition-colors">
                                <td className="px-6 py-4 text-primary italic uppercase font-black">{row.event}</td>
                                <td className="px-6 py-4 text-white font-mono">{row.price}</td>
                                <td className="px-6 py-4 text-muted-foreground font-mono">{row.from}</td>
                                <td className="px-6 py-4 text-muted-foreground font-mono">{row.to}</td>
                                <td className="px-6 py-4 text-muted-foreground">{row.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Componente para How It Works
export function HowItWorks() {
    return (
        <div className="border-2 border-white/10 bg-zinc-900/50 overflow-hidden">
            <div className="px-6 py-5 flex items-center gap-3 border-b-2 border-primary/20 bg-black">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-black italic uppercase text-sm tracking-widest text-white">How it works</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Connect Wallet", desc: "Use MetaMask or 0xAddress to log in securely." },
                    { title: "Make Offers", desc: "Submit your offer in SYS to the owner." },
                    { title: "Instant Buy", desc: "Purchase listed assets immediately." },
                ].map((step, i) => (
                    <div
                        key={i}
                        className="space-y-3 p-4 bg-black/40 border border-white/5 hover:border-primary/20 transition-colors"
                    >
                        <span className="text-primary font-black italic text-lg">0{i + 1}.</span>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{step.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
