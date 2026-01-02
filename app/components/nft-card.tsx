import { Shield } from "lucide-react"
import Link from "next/link"

interface NFTCardProps {
    name: string
    collection: string
    price: string
    image: string
    owner: string
    isVerified?: boolean
    href?: string
}

export function NFTCard({ name, collection, price, image, owner, isVerified, href }: NFTCardProps) {
    // Definimos el contenido interno de la tarjeta
    const CardContent = (
        <div className="card-nft cursor-pointer group h-full flex flex-col">
            {/* Imagen del NFT */}
            <div className="relative aspect-square bg-zinc-900 overflow-hidden border-b-2 border-border group-hover:border-primary transition-colors">
                <img
                    src={image || "/placeholder.svg"}
                    alt={name}
                    className="object-cover w-full h-full group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm px-3 py-1.5 border border-primary/30">
                    <span className="text-[10px] font-black text-primary tracking-widest uppercase italic">Rollux</span>
                </div>
            </div>

            {/* Detalles */}
            <div className="p-6 flex flex-col gap-4 bg-black flex-1 justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="data-label text-primary">{collection}</span>
                        {isVerified && <Shield className="w-3.5 h-3.5 text-primary fill-primary/20" />}
                    </div>
                    <h3 className="text-xl font-black italic tracking-tighter text-white truncate uppercase">{name}</h3>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-border">
                    <div className="flex flex-col gap-1">
                        <span className="data-label">Price</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-white">{price}</span>
                            <span className="text-primary font-black text-xs italic">SYS</span>
                        </div>
                    </div>
                    {/* Botón visual (div) para que el Link padre maneje el clic sin nesting inválido */}
                    <div className="bg-primary text-black font-black px-5 py-2.5 text-[10px] uppercase tracking-wider hover:bg-white transition-colors border-2 border-primary active:scale-95 text-center">
                        BUY
                    </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Owner</span>
                        <span className="text-[11px] font-mono text-white font-bold">{owner}</span>
                    </div>
                    {/* Removed ExternalLink as requested */}
                </div>
            </div>
        </div>
    )

    // Si hay href, envolvemos todo en un Link
    if (href) {
        return <Link href={href} className="block h-full">{CardContent}</Link>
    }

    return CardContent
}
