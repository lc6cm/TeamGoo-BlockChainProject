
# Checkpoint 4 Evidence - TeamGoo Ticket Marketplace

## Project Information

- **Project:** Blockchain Ticket Marketplace
- **Team:** Joey Contreras and Lupe Campos
- **Network:** DIDLab
- **Chain ID:** `252501`
- **Live Application:** https://teamgoo.didlab.org
- **Repository:** https://github.com/lc6cm/TeamGoo-BlockChainProject
- **Marketplace Contract:** `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- **Registry Contract:** `0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`

## 1. Checkpoint 4 Overview

Checkpoint 4 focused on completing the TeamGoo Ticket Marketplace and preparing the application for its final course project release.

The application demonstrates blockchain-based ticket issuance, purchasing, resale, ownership verification, and redemption.

Final development work included:

- Expanding the marketplace to display multiple tickets and events.
- Adding event information, including names, dates, venues, descriptions, and prices.
- Improving ticket purchasing and resale functionality.
- Adding a My Tickets section.
- Implementing administrator and issuer workflows.
- Adding admission-code functionality.
- Implementing ticket verification and redemption controls.
- Displaying ticket prices in USD while processing payments in TRUST.
- Improving transaction handling and user feedback.
- Updating the project documentation.

The project continues to use the deployed TicketMarketplace smart contract on DIDLab.

## 2. Smart Contract Deployment Evidence

### TicketMarketplace

- Chain ID: `252501`
- Contract address: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Deployment transaction: `0x8016127577e2a64eac0c1f7869f9142bbd0869c281a7faba7bff6eb6547ff833`
- Deployment script: `scripts/deploy.js`
- What it proves: The marketplace contract was deployed to DIDLab.

### TicketRecordRegistry

- Chain ID: `252501`
- Contract address: `0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`
- Deployment transaction: `0xa3726c9fe60321a5e1bad842312936b93a025d56f95956c0e90418de713cb536`
- What it proves: The record registry was deployed to DIDLab.

These contracts were deployed during earlier checkpoints and remain part of the final project.

The Checkpoint 4 frontend improvements did not require smart contract redeployment.

## 3. Marketplace Functionality

### Ticket Browsing

The marketplace interface was expanded to support multiple tickets and events.

The frontend includes:

- Event names.
- Event dates.
- Event venues.
- Event descriptions.
- Ticket prices.
- Ticket availability.
- Ticket ownership information.

Blockchain ticket information is retrieved using ethers.js.

### Ticket Purchasing

The application supports primary ticket purchases through MetaMask.

Users connect their wallet, select an available ticket, approve the transaction, and wait for blockchain confirmation.

The contract updates ticket ownership after a successful purchase.

### Ticket Resale

The marketplace supports:

- Listing eligible tickets for resale.
- Purchasing resale tickets.
- Canceling resale listings.
- Displaying updated ownership information.

### My Tickets

The My Tickets section allows users to view tickets associated with their connected wallet.

Ticket holders can access ticket information and available ownership-related actions.

### Transaction Handling

The frontend includes handling for:

- Pending transactions.
- Confirmed transactions.
- Reverted transactions.
- User-rejected transactions.
- Incorrect blockchain networks.
- Disconnected wallets.

Previous transaction handling tests are documented in the Checkpoint 3 evidence file.

## 4. Administrator and Issuer Functionality

### Admin Dashboard

The Admin Dashboard is restricted to the contract owner.

Administrative functionality includes:

- Checking issuer authorization.
- Authorizing issuer wallets.
- Revoking issuer permissions.
- Submitting transactions through MetaMask.

Authorization is enforced by the smart contract.

### Issuer Dashboard

Authorized issuers can:

- Access issuer-specific functionality.
- Create event information.
- Mint tickets.
- Set primary ticket prices.
- View issuer-related tickets.
- Access ticket redemption controls.

### Ticket Minting Evidence

An authorized issuer minted Ticket #2 through the frontend.

- Ticket ID: `2`
- Issuer: `0xD40963bf3d072203B607387339774c90730c1939`
- Primary price: `0.01 TRUST`
- Transaction hash: `0xd7c82b2834f4dac49e0632e666a8d4d93ae01b0b3023de631705f7015c58ea46`

What it proves: The issuer dashboard was used to submit a ticket minting transaction through MetaMask.

The successful minting confirmation was documented during development.

## 5. Ticket Admission and Redemption

The final application includes admission-code functionality and issuer redemption controls.

The admission workflow includes:

1. A ticket holder accesses their admission information.
2. An authorized event operator obtains the admission information.
3. The application checks the ticket's eligibility.
4. The operator submits the redemption action.
5. The blockchain updates the ticket's redemption state.
6. The frontend displays the updated ticket status.

The smart contract maintains redemption state to help prevent duplicate ticket usage.

Previously documented automated tests covered unauthorized redemption and repeated redemption attempts.

A separate Checkpoint 4 redemption transaction receipt is not included in this evidence record.

## 6. USD Pricing and TRUST Conversion

During Checkpoint 4, the frontend was updated to display ticket prices in US dollars.

Blockchain transactions continue to use DIDLab TRUST tokens.

### Fixed Conversion Rate

- 0.01 TRUST = $10.00 USD.
- 1 TRUST = $1,000.00 USD.
- 0.0125 TRUST = $12.50 USD.
- 0.025 TRUST = $25.00 USD.

### Implementation

The frontend includes JavaScript conversion functions:

- `usdToTrustWei()`
- `trustWeiToUsd()`

Prices are formatted with two decimal places using `toFixed(2)`.

This ensures that values such as $10.00 and $12.50 are displayed consistently.

### Repository Evidence

- Frontend file: `frontend/public/index.html`
- Deployment copy: `public/index.html`
- Commit: `eb44b51`
- Commit message: `Display ticket prices in USD using fixed TRUST conversion`

What it proves: The fixed USD-to-TRUST conversion functionality was committed to the repository.

The conversion rate is a project-defined value rather than a live market exchange rate.

## 7. Verified Blockchain Transactions

The following transactions were previously documented during Checkpoint 3 and support the functionality retained in the final application.

### Resale Listing

- Chain ID: `252501`
- Contract address: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Transaction hash: `0x93f3e27a96e8fc9850255cacb26f7a475d227b0e9a74dda9e8bb5297a6028bbc`
- Block number: `7233643`
- Gas used: `92834`
- Status: `1` (successful)
- Timestamp UTC: `2026-11-08T01:55:08.000Z`
- Event signature: `TicketListed(uint256,address,uint256)`
- What it proves: A ticket was successfully listed for resale.

### Resale Purchase

- Chain ID: `252501`
- Contract address: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Transaction hash: `0x9b7b02d09b1cb25aa616cfeeafa1b9d5c20c72691f605af1b51ceb46b8b93826`
- Block number: `7233762`
- Gas used: `44293`
- Status: `1` (successful)
- Timestamp UTC: `2026-11-08T01:59:06.000Z`
- Event signature: `SecondaryTicketSold(uint256,address,address,uint256)`
- What it proves: A buyer successfully purchased a listed ticket.

### Ticket Minting

- Chain ID: `252501`
- Contract address: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Transaction hash: `0x3e8a0d6148c78e4264151ceb2cda8a22c0a59b89e65e50df2a1f302a9403522c`
- Block number: `7268873`
- Gas used: `149022`
- Status: `1` (successful)
- Timestamp UTC: `2026-11-08T21:29:28.000Z`

Events emitted:

- `Transfer(address,address,uint256)`
- `TicketMinted(uint256,address,uint256)`

What it proves: Ticket #999 was successfully minted into marketplace escrow.

## 8. On-Chain State Verification

After minting Ticket #999, contract calls confirmed:

- Ticket ID: `999`
- Issuer: `0x0DC1AF65A6F4D747765A4B575c2Fe551Fb6fb82e`
- Owner: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Primary price: `0.01 TRUST`
- Primary listing: Active
- Redeemed: No
- Total tickets increased from `1` to `2`.

Verification functions included:

- `ownerOf()`
- `tickets()`
- `totalTickets()`

What it proves: The minting transaction updated the deployed smart contract state.

## 9. Security Evidence

### Access Control

The TicketMarketplace contract uses ownership-based administration and authorized issuer/operator mappings.

The TicketRecordRegistry uses role-based access control.

Previously documented tests covered:

- Unauthorized ticket minting.
- Unauthorized ticket redemption.
- Unauthorized record anchoring.
- Unauthorized record verification.
- Self-verification.
- Role revocation.

Result: The tested unauthorized operations were rejected.

### Reentrancy Testing

- Test helper: `contracts/ReentrancyAttacker.sol`
- Test file: `test/TicketMarketplace.test.js`
- Attack scenario: A malicious issuer attempted a reentrant purchase during its payout callback.
- Result: The reentrant purchase failed while the legitimate purchase succeeded.

Existing ticket-state checks also contributed to preventing the repeated purchase.

### Input Validation

Automated tests covered:

- Duplicate ticket identifiers.
- Zero ticket prices.
- Incorrect purchase payments.
- Double redemption.
- Duplicate registry records.
- Invalid record inputs.

Result: Tested invalid operations were rejected.

### Reverted Transaction

- Chain ID: `252501`
- Transaction hash: `0x4307d2aefa6d6087dc1f7c5fe2cc3fd90618b6e31936fc90812b763ea3ae85cf`
- Gas used: `23784`
- Status: `0` (reverted)
- What it proves: An unsuccessful blockchain transaction was recorded without changing contract state.

### Wallet Rejection

- Action: Rejected a transaction in MetaMask.
- Frontend result: Wallet rejection message displayed.
- Transaction hash: None.

What it proves: The frontend distinguished wallet rejection from an on-chain transaction failure.

## 10. Automated Testing

The project uses Hardhat for Solidity compilation and automated testing.

Command:

    npx hardhat test

### Previously Recorded Results

| Test Suite | Passing Tests |
|---|---:|
| ProjectAnchor | 4 |
| TicketMarketplace | 15 |
| TicketRecordRegistry | 12 |
| Total | 31 |

All 31 automated tests passed during the previously documented test run.

These results provide evidence of the tested contract functionality. They are not presented as a new Checkpoint 4 test execution.

## 11. Performance Evidence

Performance measurements were collected during Checkpoint 3 using actual DIDLab transactions.

### Gas Usage

| Operation | Gas Used |
|---|---:|
| Resale listing | 92,834 |
| Resale purchase | 44,293 |
| Ticket minting | 149,022 |
| Record anchoring | 185,361 |
| Record verification | 33,278 |

### Ticket Minting Latency

- Submission latency: `0.412 seconds`
- Confirmation wait: `0.668 seconds`
- Total elapsed time: `1.080 seconds`
- Gas used: `149022`
- Block number: `7268873`

These measurements represent one observed minting transaction rather than average network performance.

## 12. Encrypted Off-Chain Record Evidence

### Encryption and Storage

- Encryption: AES-256-GCM
- Storage: IPFS through Pinata
- CID: `bafkreif6muweduc3z54kkpofwgwlq7htt4i4jmj66i75nfl7wns6mbbfma`
- File size: `306 bytes`
- SHA-256 digest: `be652c41d05bcf78a53dc5b1acb87cf39f11c4b13ef23fd6957fb365e6042560`

IPFS gateway:

https://gateway.pinata.cloud/ipfs/bafkreif6muweduc3z54kkpofwgwlq7htt4i4jmj66i75nfl7wns6mbbfma

The encrypted artifact was retrieved and its SHA-256 digest was verified.

### Record Anchoring

- Chain ID: `252501`
- Contract address: `0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`
- Transaction hash: `0x9403210dae9e05b328f1e0c7a2646e1ee5751ab1fff8399acc5d5dfb8d873eb9`
- Block number: `7183962`
- Gas used: `185361`
- Status: `1`
- Timestamp UTC: `2026-11-06T22:19:06.000Z`
- Event signature: `RecordAnchored(bytes32,bytes32,string,address)`

What it proves: The encrypted record's digest and IPFS CID were anchored on DIDLab.

### Independent Verification

- Chain ID: `252501`
- Contract address: `0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`
- Transaction hash: `0xa1524e24c75e3d3fe6018e49f474b69aaf8443b32c5c3cf6ae4a28e1c95f5577`
- Block number: `7188202`
- Gas used: `33278`
- Status: `1`
- Timestamp UTC: `2026-11-07T00:40:26.000Z`
- Event signature: `RecordVerified(bytes32,address)`

What it proves: An authorized independent verifier successfully verified the anchored record.

## 13. Privacy Review

The project was reviewed for exposure of sensitive information.

- Ticket issuance records were encrypted before being uploaded to IPFS.
- Encryption keys were kept outside the repository.
- The marketplace stores ticket ownership and transaction information on-chain.
- The registry stores record identifiers, file digests, and IPFS CIDs.
- No direct personal identifiers were identified in the reviewed on-chain contract data.
- Wallet addresses remain publicly visible and pseudonymous.
- Encrypted files may become readable if their encryption keys are compromised.

The project avoids placing names, email addresses, student IDs, and other direct personal identifiers into its intended on-chain data model.

## 14. Repository and Documentation

### GitHub Repository

https://github.com/lc6cm/TeamGoo-BlockChainProject

### Live Application

https://teamgoo.didlab.org

### Documentation

The Checkpoint 4 documentation package includes:

- `README.md` - Project overview, setup, configuration, and usage.
- `docs/RUNBOOK.md` - Deployment, recovery, troubleshooting, and operations.
- `docs/CHECKPOINT_REPORT.md` - Cumulative checkpoint report.
- `docs/AI_RECORD.md` - AI development and verification record.
- `CP4_TeamGoo_evidence.md` - Checkpoint 4 evidence.

### Frontend Source

- `frontend/public/index.html`
- `public/index.html`

The frontend source and deployment copy were synchronized during development.

### Repository Evidence

The USD conversion implementation was committed and pushed to the main branch.

- Commit: `eb44b51`
- Description: `Display ticket prices in USD using fixed TRUST conversion`

The final release commit and tag are separate release-management requirements and are not represented by this earlier development commit.

## 15. Operational Runbook

The project includes an operational runbook at:

`docs/RUNBOOK.md`

The runbook describes:

- Project configuration.
- Local installation.
- Running the frontend.
- Smart contract compilation and testing.
- Frontend deployment through DIDLab.
- Smart contract redeployment.
- Operational verification.
- Troubleshooting.
- Rollback and recovery.
- Security procedures.
- Known limitations.
- Release verification.

This documentation is intended to help another developer understand how to maintain and recover the application.

## 16. Known Limitations

The project is completed for the intended academic scope, but it is not a production-ready commercial ticketing service.

Known limitations include:

- USD prices use a fixed conversion rate rather than live market pricing.
- Users require MetaMask and DIDLab TRUST tokens.
- Real-world ticket authenticity depends on authorized issuers.
- Admission-code security requires additional hardening for commercial use.
- Administrator and issuer wallets must be protected.
- The encrypted ticket registry is not fully integrated into the marketplace frontend.
- Blockchain transactions cannot automatically be reversed.
- Contract redeployment does not automatically migrate existing ticket state.
- The application depends on DIDLab hosting and RPC availability.
- Additional security auditing, accessibility testing, and scalability testing would be required for commercial deployment.

## 17. Release Preparation

Checkpoint 4 is the release candidate and feature freeze stage.

The project development work has focused on delivering the planned marketplace functionality and preparing the application for final evaluation.

The documentation package describes the deployed contracts, implemented functionality, prior transaction evidence, security testing, performance measurements, and operational procedures.

The application is intended to remain unchanged after the feature freeze except for permitted defect corrections.

A final tagged release and clean-environment verification are separate from the development evidence recorded in this document.

## 18. Conclusion

Checkpoint 4 documents the completed development scope of the TeamGoo Ticket Marketplace.

The application includes:

- Blockchain-based ticket issuance.
- Primary ticket purchasing.
- Ticket resale and cancellation.
- Ticket ownership verification.
- Administrator and issuer functionality.
- Ticket admission and redemption interfaces.
- USD price display with TRUST blockchain payments.
- Wallet integration and transaction feedback.

The supporting evidence includes previously recorded DIDLab transactions, on-chain state verification, automated tests, security testing, encrypted IPFS records, and repository changes.

The project demonstrates the intended blockchain ticketing functionality while documenting its limitations and the distinction between previously verified behavior and final release verification.

**Project Development Status: COMPLETED FOR COURSE SCOPE**
