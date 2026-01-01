// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./RewardToken.sol";

/**
 * @title RampWoolMarketplace
 * @dev Marketplace de productos textiles con sistema de recompensas en Syscoin
 */
contract RampWoolMarketplace {
    struct Product {
        uint256 id;
        address seller;
        string name;
        string description;
        string imageUrl;
        string category; // lana, algodón, seda, etc.
        uint256 price;
        uint256 stock;
        bool isActive;
        uint256 createdAt;
    }

    struct Purchase {
        uint256 productId;
        address buyer;
        uint256 quantity;
        uint256 totalPrice;
        uint256 timestamp;
        bool isCompleted;
    }

    // Estado del contrato
    address public owner;
    RewardToken public rewardToken;
    uint256 public productCounter;
    uint256 public purchaseCounter;
    uint256 public platformFee; // Porcentaje en basis points (100 = 1%)
    
    // Recompensas por compra (en tokens por cada wei gastado)
    uint256 public rewardRate = 10; // 10 tokens por cada wei gastado

    // Mappings
    mapping(uint256 => Product) public products;
    mapping(uint256 => Purchase) public purchases;
    mapping(address => uint256[]) public sellerProducts;
    mapping(address => uint256[]) public buyerPurchases;
    mapping(address => bool) public verifiedSellers;

    // Eventos
    event ProductListed(
        uint256 indexed productId,
        address indexed seller,
        string name,
        uint256 price,
        uint256 stock
    );
    
    event ProductPurchased(
        uint256 indexed purchaseId,
        uint256 indexed productId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );
    
    event RewardIssued(address indexed buyer, uint256 amount);
    event SellerVerified(address indexed seller);
    event ProductUpdated(uint256 indexed productId);
    event PlatformFeeUpdated(uint256 newFee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyVerifiedSeller() {
        require(verifiedSellers[msg.sender], "Seller not verified");
        _;
    }

    constructor(address _rewardTokenAddress) {
        owner = msg.sender;
        rewardToken = RewardToken(_rewardTokenAddress);
        platformFee = 250; // 2.5% fee inicial
        productCounter = 0;
        purchaseCounter = 0;
    }

    /**
     * @dev Listar un nuevo producto textil
     */
    function listProduct(
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        string memory _category,
        uint256 _price,
        uint256 _stock
    ) external onlyVerifiedSeller returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        require(_stock > 0, "Stock must be greater than 0");

        productCounter++;
        
        products[productCounter] = Product({
            id: productCounter,
            seller: msg.sender,
            name: _name,
            description: _description,
            imageUrl: _imageUrl,
            category: _category,
            price: _price,
            stock: _stock,
            isActive: true,
            createdAt: block.timestamp
        });

        sellerProducts[msg.sender].push(productCounter);

        emit ProductListed(productCounter, msg.sender, _name, _price, _stock);
        
        return productCounter;
    }

    /**
     * @dev Comprar un producto y recibir recompensas
     */
    function purchaseProduct(uint256 _productId, uint256 _quantity) external payable {
        Product storage product = products[_productId];
        
        require(product.isActive, "Product not active");
        require(product.stock >= _quantity, "Insufficient stock");
        require(_quantity > 0, "Quantity must be greater than 0");
        
        uint256 totalPrice = product.price * _quantity;
        require(msg.value >= totalPrice, "Insufficient payment");

        // Actualizar stock
        product.stock -= _quantity;
        
        // Registrar compra
        purchaseCounter++;
        purchases[purchaseCounter] = Purchase({
            productId: _productId,
            buyer: msg.sender,
            quantity: _quantity,
            totalPrice: totalPrice,
            timestamp: block.timestamp,
            isCompleted: false
        });

        buyerPurchases[msg.sender].push(purchaseCounter);

        // Calcular y distribuir pagos
        uint256 fee = (totalPrice * platformFee) / 10000;
        uint256 sellerAmount = totalPrice - fee;

        // Transferir al vendedor
        payable(product.seller).transfer(sellerAmount);

        // Recompensas para el comprador
        uint256 rewardAmount = totalPrice * rewardRate;
        rewardToken.mint(msg.sender, rewardAmount);

        // Devolver exceso si lo hay
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit ProductPurchased(purchaseCounter, _productId, msg.sender, _quantity, totalPrice);
        emit RewardIssued(msg.sender, rewardAmount);
    }

    /**
     * @dev Actualizar información de producto
     */
    function updateProduct(
        uint256 _productId,
        uint256 _price,
        uint256 _stock,
        bool _isActive
    ) external {
        Product storage product = products[_productId];
        require(product.seller == msg.sender, "Not product owner");

        if (_price > 0) {
            product.price = _price;
        }
        product.stock = _stock;
        product.isActive = _isActive;

        emit ProductUpdated(_productId);
    }

    /**
     * @dev Verificar vendedor (solo owner)
     */
    function verifySeller(address _seller) external onlyOwner {
        verifiedSellers[_seller] = true;
        emit SellerVerified(_seller);
    }

    /**
     * @dev Actualizar tasa de recompensa
     */
    function updateRewardRate(uint256 _newRate) external onlyOwner {
        rewardRate = _newRate;
    }

    /**
     * @dev Actualizar fee de plataforma
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Máximo 10%
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    /**
     * @dev Marcar compra como completada
     */
    function completePurchase(uint256 _purchaseId) external {
        Purchase storage purchase = purchases[_purchaseId];
        Product storage product = products[purchase.productId];
        
        require(product.seller == msg.sender, "Not product seller");
        require(!purchase.isCompleted, "Already completed");

        purchase.isCompleted = true;
    }

    /**
     * @dev Obtener productos de un vendedor
     */
    function getSellerProducts(address _seller) external view returns (uint256[] memory) {
        return sellerProducts[_seller];
    }

    /**
     * @dev Obtener compras de un comprador
     */
    function getBuyerPurchases(address _buyer) external view returns (uint256[] memory) {
        return buyerPurchases[_buyer];
    }

    /**
     * @dev Retirar fondos de fees (solo owner)
     */
    function withdrawFees() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @dev Obtener información de producto
     */
    function getProduct(uint256 _productId) external view returns (Product memory) {
        return products[_productId];
    }
}
