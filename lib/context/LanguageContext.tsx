"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

type Translations = {
    [key: string]: {
        [key: string]: string;
    };
};

const translations: Translations = {
    en: {
        connectWallet: 'Connect Wallet',
        disconnect: 'Disconnect',
        searchPlaceholder: 'Search NFTs...',
        price: 'Price',
        offers: 'offers',
        noOffers: 'No offers',
        notListed: 'Not listed',
        noNFTs: 'No NFTs found',
        loading: 'Loading...',
        available: 'Available',
        notInstalled: 'Not Installed',
        walletLocked: 'Wallet is locked. Please unlock it and try again.',
        signToVerify: 'Sign to verify wallet ownership',
        verified: 'Verified!',
        signFailed: 'Signature cancelled',
        deployNFT: 'Deploy NFT Contract',
        mintNFT: 'Mint NFT',
        youAreOwner: 'You own this collection',
        createCollection: 'Create Collection',
        deployDescription: 'Deploy your own NFT contract on the blockchain',
        deploy: 'Deploy',
        mint: 'Mint',
        collectionName: 'Collection Name',
        collectionSymbol: 'Symbol',
        royaltyPercent: 'Royalty % (0-10)',
        deployingContract: 'Deploying contract...',
        contractDeployed: 'Contract deployed!',
        mintingNFT: 'Minting NFT...',
        nftMinted: 'NFT Minted!',
        noBytecode: 'Place nft.bytecode in /contracts/ to enable deployment',
        enterTokenURI: 'Token URI (metadata URL)',
        enterRecipient: 'Recipient address',
        selectWallet: 'Select Wallet',
        chooseWallet: 'Choose how you want to connect',
        download: 'Download',
        deployingOn: 'Deploying on:',
        advancedOptions: 'Advanced Options',
        hintName: 'The display name of your NFT collection',
        hintSymbol: 'Short identifier (like a ticker), 3-5 characters',
        hintBaseURI: 'URL prefix for token metadata (IPFS or HTTP)',
        hintMaxSupply: 'Maximum NFTs that can be minted',
        hintMintPrice: 'Price per mint (0 = free)',
        hintRoyaltyReceiver: 'Address to receive royalties (default: you)',
        hintRoyaltyFee: '% of secondary sales you receive',
        switchNetwork: 'Switch Network',
        switchingNetwork: 'Switching network...',
        lastTx: 'Last Sale',
        noTx: 'No sales',
        owner: 'Owner',
        share: 'Share',
        explore: 'Explore',
        marketplace: 'Marketplace',
        collections: 'Collections',
        stats: 'Stats'
    },
    es: {
        connectWallet: 'Conectar Wallet',
        disconnect: 'Desconectar',
        searchPlaceholder: 'Buscar NFTs...',
        price: 'Precio',
        offers: 'ofertas',
        noOffers: 'Sin ofertas',
        notListed: 'No listado',
        noNFTs: 'No se encontraron NFTs',
        loading: 'Cargando...',
        available: 'Disponible',
        notInstalled: 'No instalado',
        walletLocked: 'Wallet bloqueada. Desbloquéala e intenta de nuevo.',
        signToVerify: 'Firma para verificar propiedad de la wallet',
        verified: '¡Verificado!',
        signFailed: 'Firma cancelada',
        deployNFT: 'Crear Contrato NFT',
        mintNFT: 'Mintear NFT',
        youAreOwner: 'Eres dueño de esta colección',
        createCollection: 'Crear Colección',
        deployDescription: 'Despliega tu propio contrato NFT en la blockchain',
        deploy: 'Desplegar',
        mint: 'Mintear',
        collectionName: 'Nombre de Colección',
        collectionSymbol: 'Símbolo',
        royaltyPercent: 'Regalía % (0-10)',
        deployingContract: 'Desplegando contrato...',
        contractDeployed: '¡Contrato desplegado!',
        mintingNFT: 'Minteando NFT...',
        nftMinted: '¡NFT Minteado!',
        noBytecode: 'Coloca nft.bytecode en /contracts/ para habilitar despliegue',
        enterTokenURI: 'URI del Token (URL de metadata)',
        enterRecipient: 'Dirección del destinatario',
        selectWallet: 'Seleccionar Wallet',
        chooseWallet: 'Elige cómo quieres conectarte',
        download: 'Descargar',
        deployingOn: 'Desplegando en:',
        advancedOptions: 'Opciones Avanzadas',
        hintName: 'El nombre de tu colección NFT',
        hintSymbol: 'Identificador corto (como ticker), 3-5 caracteres',
        hintBaseURI: 'URL base para metadata (IPFS o HTTP)',
        hintMaxSupply: 'Máximo de NFTs que se pueden mintear',
        hintMintPrice: 'Precio por mint (0 = gratis)',
        hintRoyaltyReceiver: 'Dirección para recibir regalías (default: tú)',
        hintRoyaltyFee: '% de ventas secundarias que recibes',
        switchNetwork: 'Cambiar Red',
        switchingNetwork: 'Cambiando red...',
        lastTx: 'Última Venta',
        noTx: 'Sin ventas',
        owner: 'Dueño',
        share: 'Compartir',
        explore: 'Explorar',
        marketplace: 'Mercado',
        collections: 'Colecciones',
        stats: 'Estadísticas'
    }
};

interface LanguageContextType {
    language: Language;
    t: (key: string) => string;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('nft-lang') as Language;
        if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
            setLanguageState(storedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('nft-lang', lang);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    const t = (key: string) => {
        return translations[language][key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
