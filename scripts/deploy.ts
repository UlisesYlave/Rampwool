import hre from "hardhat";

async function main() {
  console.log("🚀 Iniciando deployment en red:", hre.network.name);

  // Deploy RewardToken
  console.log("\n📝 Deploying RewardToken...");
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("✅ RewardToken deployed to:", rewardTokenAddress);

  // Deploy RampWoolMarketplace
  console.log("\n📝 Deploying RampWoolMarketplace...");
  const RampWoolMarketplace = await hre.ethers.getContractFactory("RampWoolMarketplace");
  const marketplace = await RampWoolMarketplace.deploy(rewardTokenAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ RampWoolMarketplace deployed to:", marketplaceAddress);

  // Deploy MarketplaceAggregator
  console.log("\n📝 Deploying MarketplaceAggregator...");
  const MarketplaceAggregator = await hre.ethers.getContractFactory("MarketplaceAggregator");
  const aggregator = await MarketplaceAggregator.deploy();
  await aggregator.waitForDeployment();
  const aggregatorAddress = await aggregator.getAddress();
  console.log("✅ MarketplaceAggregator deployed to:", aggregatorAddress);

  // Configure RewardToken to allow Marketplace to mint
  console.log("\n⚙️  Configuring RewardToken...");
  const setMarketplaceTx = await rewardToken.setMarketplace(marketplaceAddress);
  await setMarketplaceTx.wait();
  console.log("✅ Marketplace authorized to mint RWOOL tokens");

  // Get deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n👤 Deployed by:", deployer.address);

  // Verify deployer as seller (for testing)
  console.log("\n⚙️  Verifying deployer as seller...");
  const verifyTx = await marketplace.verifySeller(deployer.address);
  await verifyTx.wait();
  console.log("✅ Deployer verified as seller");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("RewardToken:", rewardTokenAddress);
  console.log("Marketplace:", marketplaceAddress);
  console.log("Aggregator:", aggregatorAddress);
  console.log("Deployer:", deployer.address);
  console.log("=".repeat(60));

  console.log("\n💡 Next steps:");
  console.log("1. Update .env.local with contract addresses:");
  console.log(`   NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=${rewardTokenAddress}`);
  console.log(`   NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}`);
  console.log(`   NEXT_PUBLIC_AGGREGATOR_ADDRESS=${aggregatorAddress}`);
  console.log("\n2. Verify contracts on explorer:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${rewardTokenAddress}`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${marketplaceAddress} ${rewardTokenAddress}`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${aggregatorAddress}`);
  
  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
