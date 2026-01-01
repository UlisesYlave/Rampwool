// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title MarketplaceAggregator
 * @dev Agregador de productos desde marketplaces externos
 */
contract MarketplaceAggregator {
    struct ExternalMarketplace {
        uint256 id;
        string name;
        string apiUrl;
        address integrator;
        bool isActive;
        uint256 addedAt;
    }

    struct ExternalProduct {
        uint256 id;
        uint256 marketplaceId;
        string externalId;
        string name;
        string description;
        string imageUrl;
        string category;
        uint256 price;
        string externalUrl;
        bool isAvailable;
        uint256 syncedAt;
    }

    address public owner;
    uint256 public marketplaceCounter;
    uint256 public externalProductCounter;

    mapping(uint256 => ExternalMarketplace) public externalMarketplaces;
    mapping(uint256 => ExternalProduct) public externalProducts;
    mapping(uint256 => uint256[]) public marketplaceProducts; // marketplaceId => productIds
    mapping(string => uint256) public externalIdToProductId; // externalId => productId
    mapping(address => bool) public authorizedIntegrators;

    event MarketplaceAdded(uint256 indexed marketplaceId, string name);
    event MarketplaceUpdated(uint256 indexed marketplaceId);
    event ProductSynced(uint256 indexed productId, uint256 indexed marketplaceId);
    event IntegratorAuthorized(address indexed integrator);
    event IntegratorRevoked(address indexed integrator);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedIntegrators[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIntegrators[msg.sender] = true;
    }

    /**
     * @dev Agregar marketplace externo
     */
    function addExternalMarketplace(
        string memory _name,
        string memory _apiUrl,
        address _integrator
    ) external onlyOwner returns (uint256) {
        marketplaceCounter++;

        externalMarketplaces[marketplaceCounter] = ExternalMarketplace({
            id: marketplaceCounter,
            name: _name,
            apiUrl: _apiUrl,
            integrator: _integrator,
            isActive: true,
            addedAt: block.timestamp
        });

        emit MarketplaceAdded(marketplaceCounter, _name);
        return marketplaceCounter;
    }

    /**
     * @dev Sincronizar producto desde marketplace externo
     */
    function syncExternalProduct(
        uint256 _marketplaceId,
        string memory _externalId,
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        string memory _category,
        uint256 _price,
        string memory _externalUrl
    ) external onlyAuthorized returns (uint256) {
        require(externalMarketplaces[_marketplaceId].isActive, "Marketplace not active");

        // Verificar si el producto ya existe
        uint256 existingProductId = externalIdToProductId[_externalId];
        
        if (existingProductId > 0) {
            // Actualizar producto existente
            ExternalProduct storage product = externalProducts[existingProductId];
            product.name = _name;
            product.description = _description;
            product.imageUrl = _imageUrl;
            product.category = _category;
            product.price = _price;
            product.externalUrl = _externalUrl;
            product.isAvailable = true;
            product.syncedAt = block.timestamp;

            emit ProductSynced(existingProductId, _marketplaceId);
            return existingProductId;
        } else {
            // Crear nuevo producto
            externalProductCounter++;

            externalProducts[externalProductCounter] = ExternalProduct({
                id: externalProductCounter,
                marketplaceId: _marketplaceId,
                externalId: _externalId,
                name: _name,
                description: _description,
                imageUrl: _imageUrl,
                category: _category,
                price: _price,
                externalUrl: _externalUrl,
                isAvailable: true,
                syncedAt: block.timestamp
            });

            marketplaceProducts[_marketplaceId].push(externalProductCounter);
            externalIdToProductId[_externalId] = externalProductCounter;

            emit ProductSynced(externalProductCounter, _marketplaceId);
            return externalProductCounter;
        }
    }

    /**
     * @dev Marcar producto como no disponible
     */
    function markProductUnavailable(uint256 _productId) external onlyAuthorized {
        require(_productId <= externalProductCounter, "Product does not exist");
        externalProducts[_productId].isAvailable = false;
    }

    /**
     * @dev Actualizar estado de marketplace
     */
    function updateMarketplaceStatus(uint256 _marketplaceId, bool _isActive) external onlyOwner {
        require(_marketplaceId <= marketplaceCounter, "Marketplace does not exist");
        externalMarketplaces[_marketplaceId].isActive = _isActive;
        emit MarketplaceUpdated(_marketplaceId);
    }

    /**
     * @dev Autorizar integrador
     */
    function authorizeIntegrator(address _integrator) external onlyOwner {
        authorizedIntegrators[_integrator] = true;
        emit IntegratorAuthorized(_integrator);
    }

    /**
     * @dev Revocar integrador
     */
    function revokeIntegrator(address _integrator) external onlyOwner {
        authorizedIntegrators[_integrator] = false;
        emit IntegratorRevoked(_integrator);
    }

    /**
     * @dev Obtener productos de un marketplace
     */
    function getMarketplaceProducts(uint256 _marketplaceId) external view returns (uint256[] memory) {
        return marketplaceProducts[_marketplaceId];
    }

    /**
     * @dev Obtener información de producto externo
     */
    function getExternalProduct(uint256 _productId) external view returns (ExternalProduct memory) {
        return externalProducts[_productId];
    }

    /**
     * @dev Obtener información de marketplace externo
     */
    function getExternalMarketplace(uint256 _marketplaceId) external view returns (ExternalMarketplace memory) {
        return externalMarketplaces[_marketplaceId];
    }

    /**
     * @dev Búsqueda de productos por categoría
     */
    function searchProductsByCategory(string memory _category) external view returns (uint256[] memory) {
        uint256[] memory matchingProducts = new uint256[](externalProductCounter);
        uint256 count = 0;

        for (uint256 i = 1; i <= externalProductCounter; i++) {
            if (
                keccak256(bytes(externalProducts[i].category)) == keccak256(bytes(_category)) &&
                externalProducts[i].isAvailable
            ) {
                matchingProducts[count] = i;
                count++;
            }
        }

        // Crear array del tamaño correcto
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = matchingProducts[i];
        }

        return result;
    }
}
