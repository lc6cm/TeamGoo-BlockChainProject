# Checkpoint 2 Evidence — TeamGoo Ticket Marketplace

## Project Information

- **Project:** Blockchain Ticket Marketplace
- **Network:** DIDLab
- **Chain ID:** `252501`
- **Live Application:** https://teamgoo.didlab.org
- **Repository:** https://github.com/lc6cm/TeamGoo-BlockChainProject

## 1. Marketplace Deployment

- **Contract:** `TicketMarketplace`
- **Contract Address:** `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- **Deployment Transaction:** `0x8016127577e2a64eac0c1f7869f9142bbd0869c281a7faba7bff6eb6547ff833`
- **Deployment Script:** `scripts/deploy.js`

**What it proves:** The marketplace contract was deployed to DIDLab.

## 2. Implemented Features

- MetaMask wallet connection
- DIDLab network detection
- Live ticket information reads
- Primary ticket purchasing
- Resale listing
- Resale cancellation
- Contract address displayed in the frontend

**Evidence:** Live application and screenshots referenced in the cumulative report.

## 3. Marketplace Transactions

Ticket #1 was purchased, listed for resale at `0.02 TRUST`, and returned to its owner after cancellation.

**Evidence Screenshots:**

- `docs/images/TicketBought.png`
- `docs/images/TicketResale.png`
- `docs/images/TicketResaleCancel.png`

The original transaction hashes, block numbers, and gas measurements for these specific Checkpoint 2 actions are not available in the documentation reviewed.

## 4. Automated Testing

**Recorded Checkpoint 2 Test Results:**

| Test Suite | Passing Tests |
|---|---:|
| ProjectAnchor | 4 |
| TicketMarketplace | 14 |
| **Total** | **18** |

**Evidence Screenshot:** `docs/images/TicketTests.png`

**Test Command:**

`npx hardhat test`

## 5. Frontend and Contract Integration

The frontend used ethers.js and MetaMask to interact with the deployed `TicketMarketplace` contract.

The application supported reading ticket information and submitting wallet-authorized transactions.

**Evidence:**

- Live website: https://teamgoo.didlab.org
- Frontend source files
- Marketplace deployment record
- Transaction screenshots

## 6. Evidence Limitations

This file was reconstructed retrospectively from the cumulative Checkpoint 2 report.

The original Checkpoint 2 screenshots and deployment transaction are referenced, but their contents and on-chain receipt metadata have not been independently reverified here.

Work completed after Checkpoint 2, including the `TicketRecordRegistry`, encrypted IPFS records, and additional security tests, is documented separately in the Checkpoint 3 materials.