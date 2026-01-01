# 🎯 RampWool - Características y Arquitectura

## 📋 Características Implementadas

### 🛍️ Marketplace Descentralizado

#### Smart Contract: `RampWoolMarketplace.sol`
- ✅ Listado de productos textiles por vendedores verificados
- ✅ Compra de productos con pago en SYS
- ✅ Sistema de categorías (lana, algodón, seda, lino, otros)
- ✅ Gestión de stock en tiempo real
- ✅ Sistema de vendedores verificados
- ✅ Comisión configurable de plataforma (default 2.5%)
- ✅ Historial completo de compras

#### Funcionalidades Frontend
- ✅ Página de marketplace con grid de productos
- ✅ Filtrado por categorías
- ✅ Búsqueda de productos
- ✅ Conexión con MetaMask
- ✅ Detección automática de red Syscoin
- ✅ UI responsive con Tailwind CSS

### 🪙 Sistema de Recompensas

#### Smart Contract: `RewardToken.sol`
- ✅ Token ERC20 estándar (RWOOL)
- ✅ Minteo automático en cada compra (10 tokens por wei gastado)
- ✅ Transferible entre usuarios
- ✅ Función de burn para holders
- ✅ Solo el marketplace puede mintear

#### Funcionalidades de Recompensas
- ✅ Emisión automática al comprar productos
- ✅ Balance visible en perfil de usuario
- ✅ Histórico de recompensas ganadas
- ✅ Transferencia peer-to-peer de tokens

### 🔗 Agregador Multi-Marketplace

#### Smart Contract: `MarketplaceAggregator.sol`
- ✅ Registro de marketplaces externos
- ✅ Sincronización de productos externos a blockchain
- ✅ Sistema de integradores autorizados
- ✅ Búsqueda por categoría
- ✅ Estado de disponibilidad en tiempo real

#### Servicios de Integración
- ✅ Estructura para integración con Etsy API
- ✅ Estructura para integración con Alibaba API
- ✅ Estructura para integración con Amazon API
- ✅ Sistema de mock data para testing
- ✅ Agregación inteligente de productos

### 🔐 Seguridad y Administración

#### Controles de Acceso
- ✅ Sistema de ownership en todos los contratos
- ✅ Modificadores de acceso (onlyOwner, onlyVerifiedSeller)
- ✅ Validaciones de entrada en todas las funciones
- ✅ Protección contra reentrada

#### Gestión Administrativa
- ✅ Verificación de vendedores
- ✅ Actualización de fees de plataforma
- ✅ Actualización de tasas de recompensa
- ✅ Retiro de fees acumuladas
- ✅ Autorización de integradores

## 🏗️ Arquitectura del Sistema

### Capas del Sistema

```
┌─────────────────────────────────────────────────┐
│           Frontend (Next.js + React)            │
│  - UI Components                                │
│  - Web3 Context & Hooks                         │
│  - State Management                             │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Ethers.js v6
                  │
┌─────────────────▼───────────────────────────────┐
│        Syscoin NEVM (EVM Compatible)            │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │   RampWoolMarketplace Contract           │  │
│  │   - Product Management                   │  │
│  │   - Purchase Logic                       │  │
│  │   - Reward Distribution                  │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │   RewardToken Contract (ERC20)           │  │
│  │   - Token Management                     │  │
│  │   - Minting & Burning                    │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │   MarketplaceAggregator Contract         │  │
│  │   - External Product Sync                │  │
│  │   - Multi-source Aggregation             │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ API Calls
                  │
┌─────────────────▼───────────────────────────────┐
│         External Marketplaces APIs              │
│  - Etsy                                         │
│  - Alibaba                                      │
│  - Amazon                                       │
└─────────────────────────────────────────────────┘
```

### Flujo de Compra

```
1. Usuario conecta wallet (MetaMask)
2. Navega marketplace y selecciona producto
3. Confirma compra con cantidad deseada
4. Frontend llama a purchaseProduct() con valor en SYS
5. Smart contract:
   - Valida stock y precio
   - Actualiza stock del producto
   - Registra la compra
   - Distribuye pago (seller + platform fee)
   - Mintea tokens RWOOL al comprador
6. Usuario recibe:
   - Confirmación de compra
   - Tokens RWOOL como recompensa
```

### Flujo de Recompensas

```
1. Compra exitosa genera evento RewardIssued
2. Marketplace llama a rewardToken.mint()
3. Tokens RWOOL se acreditan al comprador
4. Usuario puede:
   - Transferir a otros usuarios
   - Quemar (burn) sus tokens
   - Usar en futuras funcionalidades (descuentos, etc.)
```

## 🔄 Interacción entre Contratos

```
RampWoolMarketplace
       │
       ├──> RewardToken.mint()
       │    (al realizar compra)
       │
       └──> RewardToken.balanceOf()
            (para verificar recompensas)

MarketplaceAggregator
       │
       └──> Independiente
            (sincroniza productos externos)
```

## 📊 Eventos Emitidos

### RampWoolMarketplace
- `ProductListed(productId, seller, name, price, stock)`
- `ProductPurchased(purchaseId, productId, buyer, quantity, totalPrice)`
- `RewardIssued(buyer, amount)`
- `SellerVerified(seller)`
- `ProductUpdated(productId)`
- `PlatformFeeUpdated(newFee)`

### RewardToken
- `Transfer(from, to, value)`
- `Approval(owner, spender, value)`
- `Mint(to, amount)`
- `Burn(from, amount)`

### MarketplaceAggregator
- `MarketplaceAdded(marketplaceId, name)`
- `MarketplaceUpdated(marketplaceId)`
- `ProductSynced(productId, marketplaceId)`
- `IntegratorAuthorized(integrator)`
- `IntegratorRevoked(integrator)`

## 🚀 Próximas Funcionalidades

### Fase 2
- [ ] Sistema de reviews y ratings
- [ ] Perfil de vendedor con reputación
- [ ] Chat descentralizado vendedor-comprador
- [ ] Sistema de dispute resolution
- [ ] Integración con IPFS para imágenes

### Fase 3
- [ ] NFTs como certificados de autenticidad
- [ ] Programa de staking para holders de RWOOL
- [ ] Descuentos pagando con RWOOL
- [ ] Sistema de referidos con recompensas
- [ ] DAO para gobernanza de plataforma

### Fase 4
- [ ] Bridge a otras chains (cross-chain)
- [ ] Integración con más marketplaces externos
- [ ] API pública para desarrolladores
- [ ] SDK para integración en otros sitios
- [ ] App móvil (React Native)

## 📈 Métricas y Analytics

### On-Chain Metrics
- Total de productos listados
- Total de transacciones
- Volumen total en SYS
- RWOOL tokens en circulación
- Número de vendedores verificados
- Número de compradores únicos

### Off-Chain Metrics (próximo)
- Productos más vendidos
- Categorías más populares
- Vendedores top
- Tiempo promedio de transacción
- Tasa de conversión

## 🛠️ Stack Tecnológico Completo

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Web3**: Ethers.js v6
- **State**: React Context + Hooks

### Blockchain
- **Network**: Syscoin NEVM (Testnet: Tanenbaum)
- **Language**: Solidity 0.8.28
- **Framework**: Hardhat 3.x
- **Testing**: Mocha + Chai

### Tools & Infrastructure
- **Package Manager**: npm
- **Version Control**: Git
- **Deployment**: Vercel (Frontend) / Syscoin (Contracts)
- **Wallet**: MetaMask

## 📖 Recursos para Desarrolladores

### Documentación de Contratos
- Ver archivos `.sol` en `/contracts`
- Cada contrato incluye NatSpec comments
- ABIs generadas automáticamente en `/artifacts`

### Testing
```bash
npx hardhat test
```

### Deployment
```bash
# Testnet
npx hardhat run scripts/deploy.ts --network tanenbaum

# Mainnet (precaución)
npx hardhat run scripts/deploy.ts --network syscoin
```

### Verification
```bash
npx hardhat verify --network tanenbaum CONTRACT_ADDRESS [CONSTRUCTOR_ARGS]
```

---

**Construido sobre Syscoin - Blockchain escalable y segura para dApps**
