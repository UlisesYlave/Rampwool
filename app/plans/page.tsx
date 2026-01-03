import { Check, Shield, Zap, Building2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Header } from "../components/header";
import { Footer } from "../components/footer";

const plans = [
    {
        name: "STARTER",
        subtitle: "Emprendedor Textil",
        target: "Personas naturales con negocio o micro-talleres textiles que recién inician.",
        fiscal: "NRUS (Nuevo Régimen Único Simplificado)",
        limit: "Hasta S/ 96,000 anuales (S/ 8,000/mes)",
        price: "S/ 0.00",
        period: "/mes",
        commission: "2.5% sobre el valor de compra + gas fee",
        loyalty: "1% Microcrédito Automático acumulable",
        includes: ["Catálogo base de exportadores", "Soporte técnico estándar"],
        highlight: false,
    },
    {
        name: "PRO",
        subtitle: "Impulso MYPE",
        target: "Fabricantes con producción constante y medianas empresas textiles.",
        fiscal: "Régimen MYPE Tributario (RMT)",
        limit: "Ventas netas de hasta 1,700 UIT (S/ 9.35M en 2026)",
        price: "S/ 149.00",
        period: "/mes",
        commission: "1.2% + gas fee",
        loyalty: "3% Microcrédito Premium (Triplica ahorro)",
        includes: [
            "Filtros avanzados de tendencias",
            "Analíticas de ahorro fiscal",
            "Prioridad en pool de liquidez",
        ],
        highlight: true,
    },
    {
        name: "ENTERPRISE",
        subtitle: "Corporativo Industrial",
        target: "Grandes importadores y plantas industriales textiles.",
        fiscal: "Régimen General (RG)",
        limit: "Obligatorio para quienes superen las 1,700 UIT",
        price: "DESDE S/ 599.00",
        period: "/base",
        commission: "0.5% o tarifa plana personalizada",
        loyalty: "Cashback personalizado y redención prioritaria",
        includes: [
            "Integración API completa ERP/Contable",
            "Gerente de cuenta dedicado",
            "Consultoría en cumplimiento internacional",
        ],
        highlight: false,
    },
]

export default function PlansPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Header />
            <div className=" p-6 md:p-12 lg:p-20">

                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-16 space-y-4">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-sm">
                            <span className="h-px w-8 bg-primary" />
                            Suscripciones y Beneficios
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                            Nuestros <span className="text-primary">Planes</span>
                        </h1>
                        <p className="max-w-2xl text-muted-foreground font-medium text-lg leading-relaxed">
                            Selecciona el nivel de impulso que tu negocio textil necesita. Desde emprendedores NRUS hasta corporativos industriales.
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative flex flex-col h-full border-2 transition-all duration-300 ${plan.highlight
                                    ? "border-primary bg-secondary shadow-[0_0_30px_rgba(250,204,21,0.15)]"
                                    : "border-muted bg-zinc-900 hover:border-white/50"
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute top-0 right-0 text-primary font-black text-[15px] px-2 py-1 uppercase tracking-widest translate-x-[2px] -translate-y-[2px]">
                                        RECOMENDADO
                                    </div>
                                )}

                                <div className="p-8 space-y-6">
                                    <div className="space-y-1">
                                        <h2 className={`text-3xl font-black italic uppercase ${plan.highlight ? "text-white" : "text-primary"} tracking-tighter`}>
                                            {plan.name}
                                        </h2>
                                        <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                                            {plan.subtitle}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                                            <span className="text-xs font-bold text-muted-foreground uppercase">{plan.period}</span>
                                        </div>
                                        <p className="text-sm font-medium leading-tight text-white/90">
                                            {plan.target}
                                        </p>
                                    </div>

                                    <hr className="border-white/10" />

                                    <div className="space-y-6 flex-grow">
                                        <div className="space-y-4">
                                            <PlanDetail label="Perfil Fiscal" value={plan.fiscal} />
                                            <PlanDetail label="Límite Ingresos" value={plan.limit} />
                                            <PlanDetail label="Comisión" value={plan.commission} />
                                            <PlanDetail label="Lealtad" value={plan.loyalty} />
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                                Incluye:
                                            </p>
                                            <ul className="space-y-2">
                                                {plan.includes.map((item) => (
                                                    <li key={item} className="flex items-start gap-2 text-sm font-medium">
                                                        <Check className={`w-4 h-4 ${plan.highlight ? "text-white" : "text-primary"} shrink-0 mt-0.5 `} />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <button className={`w-full py-4 font-black uppercase tracking-widest text-sm border-2 transition-all ${plan.highlight
                                        ? "bg-primary text-black hover:bg-black hover:text-primary hover:border-white"
                                        : "bg-transparent text-white border-white hover:border-primary hover:text-primary"
                                        }`}>
                                        Seleccionar Plan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* FAQ / Comparison Footer */}
                    <div className="mt-24 border-t-2 border-primary/20 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <Shield className="w-10 h-10 text-primary" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Seguridad Syscoin</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Todas las transacciones operan bajo la red Rollux, garantizando fees bajos y seguridad de grado industrial.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Zap className="w-10 h-10 text-primary" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Microcréditos</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Acumula beneficios con cada importación. Redime tus créditos directamente en el pool de liquidez.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Building2 className="w-10 h-10 text-primary" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Cumplimiento SUNAT</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Planes diseñados para alinearse perfectamente con tu perfil fiscal vigente en Perú.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}

function PlanDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                {label}
            </p>
            <p className="text-sm font-black text-white/90">
                {value}
            </p>
        </div>
    )
}
