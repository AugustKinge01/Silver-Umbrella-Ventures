const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Silver Umbrella contract deployment to OneChain...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy INET Token
  console.log("📦 Deploying INET Token...");
  const INETToken = await hre.ethers.getContractFactory("INETToken");
  const inetToken = await INETToken.deploy(
    "Internet Token",
    "INET",
    8 // decimals
  );
  await inetToken.waitForDeployment();
  const inetTokenAddress = await inetToken.getAddress();
  console.log("✅ INET Token deployed to:", inetTokenAddress, "\n");

  // Deploy Payment Escrow
  console.log("📦 Deploying Payment Escrow...");
  const PaymentEscrow = await hre.ethers.getContractFactory("PaymentEscrow");
  const paymentEscrow = await PaymentEscrow.deploy();
  await paymentEscrow.waitForDeployment();
  const paymentEscrowAddress = await paymentEscrow.getAddress();
  console.log("✅ Payment Escrow deployed to:", paymentEscrowAddress, "\n");

  // Deploy Voucher NFT
  console.log("📦 Deploying Voucher NFT...");
  const VoucherNFT = await hre.ethers.getContractFactory("VoucherNFT");
  const voucherNFT = await VoucherNFT.deploy();
  await voucherNFT.waitForDeployment();
  const voucherNFTAddress = await voucherNFT.getAddress();
  console.log("✅ Voucher NFT deployed to:", voucherNFTAddress, "\n");

  // Summary
  console.log("=" .repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(60));
  console.log("\n📝 Contract Addresses:");
  console.log("INET Token:      ", inetTokenAddress);
  console.log("Payment Escrow:  ", paymentEscrowAddress);
  console.log("Voucher NFT:     ", voucherNFTAddress);
  console.log("\n💾 Add these to your .env file:");
  console.log(`VITE_INET_TOKEN_ADDRESS=${inetTokenAddress}`);
  console.log(`VITE_PAYMENT_CONTRACT_ADDRESS=${paymentEscrowAddress}`);
  console.log(`VITE_VOUCHER_CONTRACT_ADDRESS=${voucherNFTAddress}`);
  console.log("\n🔗 Network:", hre.network.name);
  console.log("=" .repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
