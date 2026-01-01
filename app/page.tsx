import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              RampWool
            </span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/marketplace"
              className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/rewards"
              className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              Recompensas
            </Link>
            <Link
              href="/sell"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Vender
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Marketplace de Textiles
            <br />
            Descentralizado
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Compra y vende productos textiles de alta calidad en Syscoin. 
            Gana recompensas RWOOL con cada compra y accede a productos de marketplaces externos.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Explorar Productos
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-all"
            >
              Conocer Más
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Marketplace Textil</h3>
            <p className="text-gray-600">
              Compra y vende lana, algodón, seda y otros textiles de calidad premium directamente en blockchain.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Sistema de Recompensas</h3>
            <p className="text-gray-600">
              Recibe tokens RWOOL por cada compra. Úsalos para descuentos o intercámbialos por SYS.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Agregador Multi-Marketplace</h3>
            <p className="text-gray-600">
              Accede a productos de múltiples marketplaces externos en una sola plataforma.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-20 text-center">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Descentralizado</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl font-bold text-blue-600 mb-2">2.5%</div>
            <div className="text-gray-600">Comisión</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl font-bold text-indigo-600 mb-2">10x</div>
            <div className="text-gray-600">Recompensas</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl font-bold text-purple-600 mb-2">Syscoin</div>
            <div className="text-gray-600">Powered by</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2026 RampWool. Marketplace descentralizado en Syscoin blockchain.</p>
        </div>
      </footer>
    </div>
  );
}
