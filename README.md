
# TeamGoo - Blockchain Ticket Marketplace

## Project Overview

TeamGoo is a blockchain-based ticket marketplace developed as a course project at Kansas State University.

The application allows authorized event issuers to create tickets, users to purchase and resell tickets, and event operators to verify and redeem tickets.

The project uses the DIDLab blockchain to maintain a shared and verifiable record of ticket ownership, transactions, and redemption status.

The goal is to reduce problems associated with counterfeit tickets, unauthorized resale, duplicate ticket usage, and reliance on centralized ticketing platforms.

**Live Application:** https://teamgoo.didlab.org

**GitHub Repository:** https://github.com/lc6cm/TeamGoo-BlockChainProject

**Blockchain Network:** DIDLab

**Chain ID:** 252501

## Team Members

- Joey Contreras
- Lupe Campos

## Problem Statement

Traditional ticket resale systems can make it difficult for buyers to independently verify whether a ticket is legitimate or whether the seller owns it.

Common problems include:

- Counterfeit tickets.
- Duplicate ticket sales.
- Unauthorized resale.
- Uncertainty about current ticket ownership.
- Dependence on centralized platforms for transaction verification.

TeamGoo addresses these problems by using smart contracts to enforce ticket ownership and transfer rules.

Ticket ownership, transfers, and redemption status can be verified using blockchain records.

Real-world ticket authenticity still depends on authorized issuers and event operators.

## Features

### Ticket Marketplace

- Browse available events and tickets.
- View event names, dates, venues, descriptions, and ticket prices.
- Connect a MetaMask wallet.
- Purchase tickets using DIDLab TRUST tokens.
- View tickets associated with the connected wallet.
- List owned tickets for resale.
- Purchase resale tickets.
- Cancel resale listings.
- View ticket ownership and redemption status.
- Receive transaction confirmation and error messages.

### Admin Dashboard

The Admin Dashboard is available to the wallet that owns the TicketMarketplace smart contract.

Administrators can:

- Check whether a wallet is an authorized issuer.
- Authorize new ticket issuers.
- Revoke issuer permissions.
- View blockchain transaction results.

Administrative permissions are enforced by the smart contract.

### Issuer Dashboard

Authorized issuers can:

- Create and manage event information.
- Mint new tickets.
- Set primary ticket prices.
- View issuer events and tickets.
- Access ticket redemption controls.
- View transaction confirmations.

Only wallets authorized by the contract owner can mint tickets.

### Ticket Admission and Redemption

The application includes admission-code functionality and issuer redemption controls.

Ticket holders can access admission information, while authorized event operators can verify and redeem eligible tickets.

The blockchain tracks redemption state to help prevent the same ticket from being redeemed multiple times.

### USD Pricing

Ticket prices are displayed in US dollars for convenience.

Blockchain transactions continue to use DIDLab TRUST tokens.

The application currently uses a fixed conversion rate:

- 0.01 TRUST = $10.00 USD
- 1 TRUST = $1,000.00 USD
- $25.00 USD = 0.025 TRUST

Displayed prices are formatted to two decimal places.

This conversion is implemented in the frontend and does not require smart contract changes.

## Technology Stack

### Blockchain

- Solidity
- DIDLab blockchain
- Hardhat
- OpenZeppelin Contracts
- Ethers.js
- MetaMask

### Frontend

- HTML
- CSS
- JavaScript

### Development Tools

- Node.js
- npm
- Git
- GitHub
- Visual Studio Code
- PowerShell

### Additional Technologies

- Express.js for local frontend hosting
- IPFS and Pinata for encrypted ticket record storage
- AES-256-GCM for encryption
- SHA-256 for file integrity verification

## Blockchain Configuration

| Setting | Value |
|---|---|
| Network | DIDLab |
| Chain ID | 252501 |
| Chain ID (Hex) | 0x3da55 |
| RPC URL | https://eth.didlab.org |
| Block Explorer | https://explorer.didlab.org |
| Native Currency | TRUST |

### Deployed Smart Contracts

**TicketMarketplace**

Address:

`0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`

The TicketMarketplace contract manages:

- Ticket issuance.
- Ticket ownership.
- Primary purchases.
- Resale listings.
- Resale purchases.
- Listing cancellations.
- Ticket redemption.
- Issuer and operator authorization.

**TicketRecordRegistry**

Address:

`0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`

The TicketRecordRegistry contract supports:

- Anchoring encrypted ticket record digests.
- Recording IPFS content identifiers.
- Independent record verification.
- Role-based access control.

The registry is a separate component and is not fully integrated into the marketplace frontend.

## Project Structure

The repository contains the following major files and directories:

```text
TeamGoo-BlockChainProject/
|
|-- contracts/
|   |-- ProjectAnchor.sol
|   |-- TicketMarketplace.sol
|   |-- TicketRecordRegistry.sol
|
|-- test/
|   |-- Contract test files
|
|-- scripts/
|   |-- Deployment and verification scripts
|
|-- frontend/
|   |-- server.js
|   |-- package.json
|   |-- public/
|       |-- index.html
|       |-- Contract ABI files
|
|-- public/
|   |-- index.html
|
|-- docs/
|   |-- CHECKPOINT_REPORT.md
|   |-- AI_RECORD.md
|   |-- RUNBOOK.md
|
|-- hardhat.config.js
|-- package.json
|-- .gitignore
|-- README.md
```

The `frontend/public/index.html` file contains the frontend implementation used for local development.

The root `public/index.html` file is maintained for the deployed website.

## Requirements

To develop or run the application locally, install:

- Node.js and npm.
- Git.
- MetaMask browser extension.
- A browser compatible with MetaMask.

For blockchain transactions, a wallet must be connected to DIDLab and contain sufficient TRUST to pay transaction fees and purchase tickets.

## Installation

### 1. Clone the Repository

Open PowerShell or another terminal and run:

```bash
git clone https://github.com/lc6cm/TeamGoo-BlockChainProject.git
cd TeamGoo-BlockChainProject
```

### 2. Install Project Dependencies

From the repository root:

```bash
npm install
```

### 3. Install Frontend Dependencies

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 4. Start the Local Frontend

From the frontend directory:

```bash
npm start
```

The Express server starts the local frontend.

Open the local address printed by the server in your browser.

The frontend connects to the deployed DIDLab smart contract rather than deploying a new contract for each local session.

## MetaMask Setup

To use the marketplace, MetaMask must be configured for DIDLab.

Add the following network:

**Network Name:** DIDLab

**RPC URL:** https://eth.didlab.org

**Chain ID:** 252501

**Currency Symbol:** TRUST

**Block Explorer:** https://explorer.didlab.org

After configuring the network:

1. Open the TeamGoo marketplace.
2. Click the wallet connection button.
3. Approve the connection in MetaMask.
4. Switch to DIDLab if necessary.
5. Confirm that the application recognizes the connected wallet.

The available actions depend on the wallet's permissions and ticket ownership.

## Using the Application

### Buying a Ticket

1. Connect MetaMask to DIDLab.
2. Browse the marketplace.
3. Select an available ticket.
4. Review the displayed USD price.
5. Confirm the purchase through MetaMask.
6. Wait for the blockchain transaction to be confirmed.
7. View the updated ticket ownership information.

The payment is processed using TRUST tokens.

### Reselling a Ticket

1. Connect the wallet that owns the ticket.
2. Open the My Tickets section.
3. Select an eligible ticket.
4. Enter the resale price.
5. Submit the listing transaction.
6. Confirm the transaction through MetaMask.
7. Wait for confirmation.

Other users can purchase the ticket through the marketplace.

The current owner can cancel an eligible resale listing.

### Issuing Tickets

1. Connect an authorized issuer wallet.
2. Open the Issuer Dashboard.
3. Enter the required event and ticket information.
4. Set the ticket price.
5. Submit the minting transaction.
6. Confirm the transaction through MetaMask.
7. Wait for blockchain confirmation.

New tickets are created through the deployed smart contract.

### Managing Issuers

1. Connect the contract owner's wallet.
2. Open the Admin Dashboard.
3. Enter the wallet address of an organization.
4. Check its authorization status.
5. Authorize or revoke issuer permissions.
6. Confirm the transaction through MetaMask.

### Redeeming Tickets

1. Connect an authorized issuer or operator wallet.
2. Open the appropriate redemption interface.
3. Obtain the ticket holder's admission information.
4. Validate the ticket.
5. Submit the redemption action.
6. Confirm the transaction.
7. Check the updated redemption status.

The smart contract enforces redemption state and applicable authorization rules.

## Smart Contract Development

### Compile Contracts

From the repository root:

```bash
npx hardhat compile
```

### Run Automated Tests

```bash
npx hardhat test
```

The previously documented test suite contained 31 passing tests:

| Contract | Passing Tests |
|---|---:|
| ProjectAnchor | 4 |
| TicketMarketplace | 15 |
| TicketRecordRegistry | 12 |
| Total | 31 |

These are previously recorded results. Tests should be rerun before the final release to confirm the current repository state.

### Deployment

The project includes deployment scripts for deploying smart contracts to DIDLab.

The marketplace frontend currently references the deployed TicketMarketplace contract.

Redeploying the contract creates a new contract address and requires updating the frontend configuration.

Routine frontend updates do not require smart contract redeployment.

See `docs/RUNBOOK.md` for deployment, recovery, and troubleshooting procedures.

## Environment Variables and Secrets

The project may require environment configuration for contract deployment and optional off-chain integrations.

Examples include:

- DIDLab RPC configuration.
- A deployment wallet private key.
- IPFS or Pinata credentials.
- Encryption keys for off-chain ticket records.

The exact environment variable names must match the repository's configuration files and scripts.

Do not commit:

- `.env` files containing secrets.
- Wallet private keys.
- Seed phrases.
- API tokens.
- Encryption recovery keys.

Sensitive configuration must remain outside version control.

The deployed frontend should not contain private keys or secret credentials.

## Security and Privacy

The application uses several security mechanisms:

- Smart contract access control for administrators and issuers.
- Wallet-based transaction authorization.
- OpenZeppelin security libraries.
- Reentrancy protection in purchase functions.
- Input validation and invalid-state checks.
- On-chain redemption status.
- Encrypted off-chain ticket records.
- SHA-256 file integrity verification.

Ticket IDs, wallet addresses, ownership, and transaction information are publicly visible on the blockchain.

Personal information and sensitive ticket files should remain off-chain.

Wallet addresses are pseudonymous and may potentially be associated with individuals.

## Testing and Verification

The project has been tested using:

- Hardhat automated contract tests.
- Multiple MetaMask wallets.
- Authorized and unauthorized contract interactions.
- Ticket minting and purchasing transactions.
- Resale listing and cancellation.
- Transaction receipt verification.
- Reverted and rejected transaction scenarios.
- Encrypted file integrity checks.
- DIDLab blockchain explorer inspection.

Transaction evidence and additional testing details are documented in:

`docs/CHECKPOINT_REPORT.md`

The blockchain explorer allows users to inspect public transactions independently.

## Known Limitations

TeamGoo is a completed academic course project and is not intended to operate as a production commercial ticketing platform.

Current limitations include:

- USD pricing uses a fixed TRUST conversion rate.
- Users need MetaMask and DIDLab TRUST tokens.
- Real-world ticket authenticity depends on trusted issuers.
- Admission-code security would require additional production hardening.
- Administrator and issuer keys must be protected.
- The encrypted ticket registry is not fully integrated into the marketplace interface.
- Additional scalability, accessibility, and security testing would be necessary before commercial deployment.
- The current deployment depends on the availability of DIDLab infrastructure.

These limitations do not prevent the project from demonstrating blockchain-based ticket issuance, ownership tracking, resale, and redemption.

## Project Documentation

Additional documentation is available in the repository:

- `docs/CHECKPOINT_REPORT.md` - Project progress, testing, security, performance, and checkpoint evidence.
- `docs/AI_RECORD.md` - Record of AI assistance, generated suggestions, verification, and corrections.
- `docs/RUNBOOK.md` - Deployment, recovery, operations, and troubleshooting procedures.
- `CP4_TeamGoo_evidence.md` - Checkpoint 4 evidence records.

## Project Status

**Status: Completed for the course project**

TeamGoo demonstrates a functional blockchain-based ticket marketplace with ticket issuance, purchasing, resale, wallet integration, and ticket redemption.

The application uses smart contracts to provide a shared, independently verifiable record of ticket ownership and state changes.

Further development would be required for commercial production use.

## Links

**Live Application:** https://teamgoo.didlab.org

**Repository:** https://github.com/lc6cm/TeamGoo-BlockChainProject

**DIDLab Explorer:** https://explorer.didlab.org
