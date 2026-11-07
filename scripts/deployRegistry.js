
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  if (network.chainId !== 252501n) {
    throw new Error("Wrong network. Expected DIDLab (252501).");
  }

  console.log("Deployer:", deployer.address);
  console.log("Deploying TicketRecordRegistry...");

  const Registry = await ethers.getContractFactory(
    "TicketRecordRegistry"
  );

  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  const tx = registry.deploymentTransaction();
  const receipt = await tx.wait();

  console.log("\n=== REGISTRY DEPLOYMENT ===");
  console.log("Registry address:", address);
  console.log("Deployment transaction:", tx.hash);
  console.log("Block number:", receipt.blockNumber);
  console.log("Gas used:", receipt.gasUsed.toString());
  console.log("Status:", receipt.status);
  console.log("Admin wallet:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
