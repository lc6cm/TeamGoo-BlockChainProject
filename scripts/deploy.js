
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Deployer:", await deployer.getAddress());
  console.log(
    "Balance:",
    ethers.formatEther(
      await ethers.provider.getBalance(await deployer.getAddress())
    )
  );

  // Safety check: never deploy to the wrong network.
  if (network.chainId !== 252501n) {
    throw new Error("Wrong network! Expected DIDLab chain ID 252501.");
  }

  const TicketMarketplace =
    await ethers.getContractFactory("TicketMarketplace");

  console.log("\nDeploying TicketMarketplace...");
  const marketplace = await TicketMarketplace.deploy();
  await marketplace.waitForDeployment();

  const address = await marketplace.getAddress();
  const deploymentTx = marketplace.deploymentTransaction();

  console.log("\n=== DEPLOYMENT RECORD ===");
  console.log("Contract address:", address);
  console.log("Deployment transaction:", deploymentTx.hash);

  // Authorize this wallet to issue tickets.
  const issuerTx = await marketplace.setIssuer(
    await deployer.getAddress(),
    true
  );
  await issuerTx.wait();
  console.log("Issuer authorization transaction:", issuerTx.hash);

  // Authorize this wallet to redeem tickets.
  const operatorTx = await marketplace.setOperator(
    await deployer.getAddress(),
    true
  );
  await operatorTx.wait();
  console.log("Operator authorization transaction:", operatorTx.hash);

  // Mint a sample ticket priced at 0.01 native DIDLab tokens.
  const price = ethers.parseEther("0.01");
  const mintTx = await marketplace.mintTicket(1, price);
  await mintTx.wait();

  console.log("Ticket mint transaction:", mintTx.hash);
  console.log("Sample ticket ID: 1");
  console.log("Sample ticket price:", ethers.formatEther(price));
  console.log("\nDeployment and demo setup complete.");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
