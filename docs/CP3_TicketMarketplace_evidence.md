# Checkpoint 3 Evidence — TeamGoo Ticket Marketplace

## Project Information

- **Project:** Blockchain Ticket Marketplace
- **Team:** Joey Contreras and Lupe Campos
- **Network:** DIDLab
- **Chain ID:** `252501`
- **Live Application:** https://teamgoo.didlab.org
- **Repository:** https://github.com/lc6cm/TeamGoo-BlockChainProject
- **Marketplace Contract:** `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- **Registry Contract:** `0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`

## 1. Contract Deployments

### TicketMarketplace

- Chain ID: `252501`
- Contract address: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Deployment transaction: `0x8016127577e2a64eac0c1f7869f9142bbd0869c281a7faba7bff6eb6547ff833`
- Deployment script: `scripts/deploy.js`
- What it proves: Deployment of the marketplace contract to DIDLab.

### TicketRecordRegistry

- Chain ID: `252501`
- Contract address: `0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`
- Deployment transaction: `0xa3726c9fe60321a5e1bad842312936b93a025d56f95956c0e90418de713cb536`
- What it proves: Deployment of the record registry to DIDLab.

## 2. Marketplace Transactions

### Resale Listing

- Chain ID: `252501`
- Contract address: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Transaction hash: `0x93f3e27a96e8fc9850255cacb26f7a475d227b0e9a74dda9e8bb5297a6028bbc`
- Block number: `7233643`
- Gas used: `92834`
- Status: `1` (successful)
- Timestamp UTC: `2026-11-08T01:55:08.000Z`
- Event signature: `TicketListed(uint256,address,uint256)`
- Event topic: `0x22968ec3be3687b180f3544163a034b88d57b48159d9a7e9a1b610fdb2d05f80`
- What it proves: A resale listing transaction succeeded.

### Resale Purchase

- Chain ID: `252501`
- Contract address: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Transaction hash: `0x9b7b02d09b1cb25aa616cfeeafa1b9d5c20c72691f605af1b51ceb46b8b93826`
- Block number: `7233762`
- Gas used: `44293`
- Status: `1` (successful)
- Timestamp UTC: `2026-11-08T01:59:06.000Z`
- Event signature: `SecondaryTicketSold(uint256,address,address,uint256)`
- Event topic: `0xe8c51d8978e855a6c65c1c074ca61a85b3f1e77dae9642ee2db4a1fab33e43e0`
- What it proves: A buyer successfully purchased a listed ticket.

### Ticket Minting

- Chain ID: `252501`
- Contract address: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Transaction hash: `0x3e8a0d6148c78e4264151ceb2cda8a22c0a59b89e65e50df2a1f302a9403522c`
- Block number: `7268873`
- Gas used: `149022`
- Status: `1` (successful)
- Timestamp UTC: `2026-11-08T21:29:28.000Z`

**Events Emitted:**

- Event signature: `Transfer(address,address,uint256)`
- Event topic: `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`
- Event signature: `TicketMinted(uint256,address,uint256)`
- Event topic: `0x5c1c9352d51031acc9a558d7cdcca15b0ce5fe4f46d7315cca355248175b0a37`

What it proves: Ticket #999 was successfully minted into marketplace escrow.

### Minting State Verification

After the transaction:

- Ticket ID: `999`
- Issuer: `0x0DC1AF65A6F4D747765A4B575c2Fe551Fb6fb82e`
- Owner: `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- Primary price: `0.01 TRUST`
- Primary listing: Active
- Redeemed: No
- Total tickets increased from `1` to `2`.

The contract state was verified using `ownerOf()`, `tickets()`, and `totalTickets()`.

## 3. Performance Measurements

Performance was measured on DIDLab using the Hardhat console and JavaScript `Date.now()`.

### Gas Usage

| Operation | Gas Used | Status |
|---|---:|---|
| Resale listing | 92,834 | Successful |
| Resale purchase | 44,293 | Successful |
| Ticket minting | 149,022 | Successful |
| Record anchoring | 185,361 | Successful |
| Record verification | 33,278 | Successful |

### Ticket Minting Latency

- Submission latency: `0.412 seconds`
- Confirmation wait: `0.668 seconds`
- Total elapsed time: `1.080 seconds`
- Gas used: `149022`
- Block number: `7268873`

These are client-observed measurements from one minting transaction.

Confirmation wait represents the time between receiving the transaction hash and receiving confirmation through the transaction receipt.

Latency measurements were not collected for the other transactions.

## 4. Security Evidence

### Access Control Testing

The `TicketMarketplace` contract uses OpenZeppelin Ownable and authorized issuer/operator mappings.

The `TicketRecordRegistry` contract uses OpenZeppelin AccessControl with ADMIN, SUBMITTER, and VERIFIER roles.

Tests covered:

- Unauthorized ticket minting.
- Unauthorized ticket redemption.
- Unauthorized record anchoring.
- Unauthorized record verification.
- Self-verification.
- Actions after role revocation.

**Result:** Tested unauthorized operations were rejected.

### Reentrancy Testing

- Test helper: `contracts/ReentrancyAttacker.sol`
- Test file: `test/TicketMarketplace.test.js`
- Attack scenario: A malicious issuer attempted to purchase the same ticket again during its payout callback.
- Result: The reentrant attempt failed, while the legitimate purchase succeeded.

The ticket-state checks also prevent the repeated purchase, so this test does not establish that ReentrancyGuard was the only reason the attempt failed.

### Input Validation and State Transition Testing

Tests covered:

- Duplicate ticket identifiers.
- Zero ticket prices.
- Incorrect purchase payments.
- Double redemption.
- Duplicate registry records.
- Repeated record verification.
- Invalid record inputs.

**Result:** The tested invalid operations were rejected.

### Automated Test Results

**Command:**

`npx hardhat test`

| Test Suite | Passing Tests |
|---|---:|
| ProjectAnchor | 4 |
| TicketMarketplace | 15 |
| TicketRecordRegistry | 12 |
| **Total** | **31** |

**Result: All 31 automated tests passed.**

### Reverted Transaction

- Chain ID: `252501`
- Transaction hash: `0x4307d2aefa6d6087dc1f7c5fe2cc3fd90618b6e31936fc90812b763ea3ae85cf`
- Gas used: `23784`
- Status: `0` (reverted)
- What it proves: An unsuccessful on-chain transaction was recorded without changing the contract state.

### Wallet Rejection

- Action: Rejected a transaction in MetaMask.
- Frontend result: Wallet rejection message displayed.
- Transaction hash: None.
- What it proves: The frontend distinguished a user-rejected transaction from an on-chain failure.

## 5. Encrypted Off-Chain Ticket Record

### Encryption and IPFS Storage

- Encryption: AES-256-GCM
- Storage provider: Pinata
- Storage network: IPFS
- CID: `bafkreif6muweduc3z54kkpofwgwlq7htt4i4jmj66i75nfl7wns6mbbfma`
- File size: `306 bytes`
- SHA-256 digest: `be652c41d05bcf78a53dc5b1acb87cf39f11c4b13ef23fd6957fb365e6042560`

**IPFS Gateway:**

https://gateway.pinata.cloud/ipfs/bafkreif6muweduc3z54kkpofwgwlq7htt4i4jmj66i75nfl7wns6mbbfma

The encrypted artifact was retrieved and its SHA-256 digest verified.

### Registry Anchoring

- Chain ID: `252501`
- Contract address: `0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`
- Transaction hash: `0x9403210dae9e05b328f1e0c7a2646e1ee5751ab1fff8399acc5d5dfb8d873eb9`
- Block number: `7183962`
- Gas used: `185361`
- Status: `1`
- Timestamp UTC: `2026-11-06T22:19:06.000Z`
- Event signature: `RecordAnchored(bytes32,bytes32,string,address)`
- Event topic: `0x23b33bad562fe95ca9df0fdb950ccbf2b9f963becaa6b2d091a3a786f780c532`
- Record ID: `0x27b32b0fbeb1c80a6150d865a7ae16fab97fa1c458ca24e3ce8494fba44b1281`
- What it proves: The encrypted artifact's digest and IPFS CID were anchored on DIDLab.

### Independent Record Verification

- Chain ID: `252501`
- Contract address: `0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963`
- Transaction hash: `0xa1524e24c75e3d3fe6018e49f474b69aaf8443b32c5c3cf6ae4a28e1c95f5577`
- Block number: `7188202`
- Gas used: `33278`
- Status: `1`
- Timestamp UTC: `2026-11-07T00:40:26.000Z`
- Event signature: `RecordVerified(bytes32,address)`
- Event topic: `0xae761a2ab8474ed7da3630fb81609c292f0bd3bde65bdf2f0442ce95e6286a4e`
- What it proves: An authorized independent verifier successfully verified the anchored record.

### Role Revocation

- Transaction hash: `0xf0f459a7bb867221dcf4089923678690ab66218be0c0771485ec4388b49d210b`
- Verification: `hasRole()` returned `false` after revocation.
- What it proves: A temporary verification permission was successfully removed.

## 6. File Integrity Tampering Test

- Script: `scripts/bitFlipDemo.js`
- Original SHA-256: `be652c41d05bcf78a53dc5b1acb87cf39f11c4b13ef23fd6957fb365e6042560`
- Modified SHA-256: `aa77d32448dc584875ccd7d6e9d469e503f755e5410acf7a41633c60e86de1b6`
- File size: `306 bytes`
- Bits modified: `1`
- Result: Digest mismatch detected.

**What it proves:** Modifying even one bit of the encrypted artifact changes its digest and causes the integrity check to fail.

## 7. Frontend Evidence

**Live Application:** https://teamgoo.didlab.org

The following behaviors were tested:

- MetaMask wallet connection.
- DIDLab chain detection.
- Reading ticket information from the deployed contract.
- Resale listing.
- Resale purchase using a separate wallet.
- Transaction pending and confirmed feedback.
- Reverted transaction reporting.
- Wallet rejection handling.
- Disconnected-wallet public reads.
- Transfer event detection and ticket state refresh.
- Unauthorized registry verification through a direct browser-console contract call.

The registry's anchoring and verification functions were demonstrated through scripts and contract calls rather than dedicated frontend controls.

## 8. Privacy Review

- Ticket records were encrypted before being uploaded to IPFS.
- Encryption keys were stored locally and excluded from Git.
- The marketplace stores ticket information and wallet addresses on-chain.
- The registry stores record identifiers, file digests, and IPFS CIDs.
- No direct personal identifiers were identified in the reviewed on-chain contract data.
- Wallet addresses are pseudonymous and may be linked to individuals.
- Publicly accessible encrypted files could become readable if encryption keys are compromised.

## 9. Evidence Limitations

- Transaction latency was measured for one ticket minting operation.
- Some deployment and transaction receipt metadata is not yet included.
- The registry is deployed and functional, but dedicated registry controls are not integrated into the live frontend.
- The security review and automated tests do not replace a comprehensive independent audit.
- Marketplace event signatures were verified against the contract ABI; the listing and purchase event topics have not been independently matched to their transaction receipts in this record.

## 10. Conclusion

Checkpoint 3 evidence demonstrates:

- Successful live marketplace transactions on DIDLab.
- Multiple smart contract operations with recorded gas usage.
- Successful ticket minting and on-chain state verification.
- Encrypted off-chain storage using IPFS.
- On-chain artifact anchoring and independent verification.
- Role-based access control and adversarial security testing.
- 31 passing automated tests.
- Measured transaction submission and confirmation latency.

The evidence supports the implemented marketplace and registry workflows while documenting the remaining limitations.