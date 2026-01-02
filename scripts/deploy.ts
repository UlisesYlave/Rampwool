import hre from "hardhat";

async function main() {
  console.log("🚀 Iniciando deployment en red:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployed by:", deployer.address);

  // Constants
  const NAME = "RampWool Demo";
  const SYMBOL = "RWD";
  const BASE_URI = "https://picsum.photos/id/"; // Placeholder compatible with DemoNFT
  const MAX_SUPPLY = 10000;
  const MINT_PRICE = hre.ethers.parseEther("0.01"); // 0.01 SYS
  const ROYALTY_FEE = 500; // 5%
  const MARKETPLACE_FEE = 250; // 2.5%

  // 1. Deploy NFTMarketplace
  console.log("\n📝 Deploying NFTMarketplace...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  // Constructor: (fee, feeRecipient)
  const marketplace = await NFTMarketplace.deploy(MARKETPLACE_FEE, deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ NFTMarketplace deployed to:", marketplaceAddress);

  // 2. Deploy DemoNFT
  console.log("\n📝 Deploying DemoNFT...");
  const DemoNFT = await hre.ethers.getContractFactory("DemoNFT");
  // Constructor: (name, symbol, baseURI, maxSupply, mintPrice, royaltyReceiver, royaltyFee)
  const demoNFT = await DemoNFT.deploy(
    NAME,
    SYMBOL,
    BASE_URI,
    MAX_SUPPLY,
    MINT_PRICE,
    deployer.address,
    ROYALTY_FEE
  );
  await demoNFT.waitForDeployment();
  const demoNFTAddress = await demoNFT.getAddress();
  console.log("✅ DemoNFT deployed to:", demoNFTAddress);

  // 3. Mint some initial NFTs for testing
  console.log("\n🎨 Minting initial NFTs...");
  const uris = ["1/200", "2/200", "3/200", "4/200", "5/200"]; // Simple IDs for picsum
  // Mint 5 NFTs to deployer
  for (let i = 0; i < uris.length; i++) {
    const tx = await demoNFT.mint(deployer.address, uris[i], { value: MINT_PRICE });
    await tx.wait();
    console.log(`   Minted Token #${i} to ${deployer.address}`);
  }

  // 4. List one NFT on Marketplace
  console.log("\n🏷️  Listing Token #0...");
  const approveTx = await demoNFT.approve(marketplaceAddress, 0);
  await approveTx.wait();

  const listPrice = hre.ethers.parseEther("0.1");
  const listTx = await marketplace.createListing(demoNFTAddress, 0, listPrice);
  await listTx.wait();
  console.log(`   Listed Token #0 for 0.1 SYS`);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("NFTMarketplace:", marketplaceAddress);
  console.log("DemoNFT:", demoNFTAddress);
  console.log("Deployer:", deployer.address);
  console.log("TEST ACCOUNT PRIVATE KEY (Hardhat #0): 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  console.log("=".repeat(60));

  console.log("\n💡 Next steps:");
  console.log("1. Update .env.local with contract addresses:");
  console.log(`   NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}`);
  console.log(`   NEXT_PUBLIC_NFT_ADDRESS=${demoNFTAddress}`); // Useful if we had a variable for this
  console.log("\n2. URL to view detailed item:");
  console.log(`   http://localhost:3000/item/31337/${demoNFTAddress}/0`);

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
