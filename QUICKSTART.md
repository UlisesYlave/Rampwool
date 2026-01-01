# 🚀 RampWool - Guía de Inicio Rápido

## Instalación en 5 pasos

### 1️⃣ Instalar dependencias

```bash
npm install --legacy-peer-deps
```

### 2️⃣ Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tu private key de MetaMask (solo para desarrollo):

```env
PRIVATE_KEY=tu_private_key_aqui
```

### 3️⃣ Compilar contratos

```bash
npx hardhat compile
```

### 4️⃣ Desplegar contratos en Syscoin Testnet

```bash
npx hardhat run scripts/deploy.ts --network tanenbaum
```

Copia las direcciones de los contratos desplegados y actualiza tu `.env.local`:

```env
NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_AGGREGATOR_ADDRESS=0x...
```

### 5️⃣ Iniciar aplicación

```bash
npm run dev
```

Visita `http://localhost:3000` 🎉

## ⚡ Testing Local (sin blockchain)

Si quieres probar la UI sin desplegar contratos:

1. Inicia nodo local de Hardhat:
```bash
npx hardhat node
```

2. En otra terminal, despliega en localhost:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

3. Conecta MetaMask a `http://localhost:8545` con Chain ID `31337`

4. Importa una de las cuentas de prueba de Hardhat en MetaMask

5. Inicia la app:
```bash
npm run dev
```

## 🦊 Configurar MetaMask para Syscoin

### Syscoin Tanenbaum Testnet

- **Network Name**: Syscoin Tanenbaum Testnet
- **RPC URL**: https://rpc.tanenbaum.io
- **Chain ID**: 5700
- **Currency Symbol**: tSYS
- **Block Explorer**: https://tanenbaum.io

### Obtener tSYS de prueba

Visita el faucet: https://faucet.tanenbaum.io

## 📁 Estructura del Proyecto

```
rampwool/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Página principal
│   ├── marketplace/         # Página de marketplace
│   └── ...
├── contracts/               # Smart Contracts
│   ├── RampWoolMarketplace.sol
│   ├── RewardToken.sol
│   └── MarketplaceAggregator.sol
├── lib/                     # Utilidades y hooks
│   ├── web3Config.ts       # Configuración Web3
│   ├── hooks/              # React hooks
│   └── services/           # Servicios externos
├── scripts/                 # Scripts de deployment
│   └── deploy.ts
├── hardhat.config.ts       # Configuración Hardhat
└── package.json
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Build para producción
npm run lint             # Ejecutar linter

# Hardhat
npx hardhat compile      # Compilar contratos
npx hardhat test         # Ejecutar tests
npx hardhat clean        # Limpiar artifacts
npx hardhat node         # Nodo local

# Deployment
npx hardhat run scripts/deploy.ts --network tanenbaum  # Testnet
npx hardhat run scripts/deploy.ts --network syscoin    # Mainnet

# Verificación
npx hardhat verify --network tanenbaum DIRECCION_CONTRATO
```

## ❓ Troubleshooting

### Error: "Cannot find module 'ethers'"

```bash
npm install ethers@6 --legacy-peer-deps
```

### Error: "Contract not initialized"

Asegúrate de:
1. Haber desplegado los contratos
2. Actualizado las direcciones en `.env.local`
3. Reiniciado el servidor Next.js

### MetaMask no se conecta

1. Verifica que estés en la red correcta (Tanenbaum Testnet)
2. Recarga la página
3. Desconecta y vuelve a conectar la wallet

### Error al compilar contratos

```bash
npx hardhat clean
npx hardhat compile
```

## 📚 Recursos Adicionales

- [Documentación Syscoin](https://docs.syscoin.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)

## 🆘 Soporte

¿Necesitas ayuda? Abre un issue en GitHub o únete a nuestro Discord.

---

**¡Feliz desarrollo! 🎉**
