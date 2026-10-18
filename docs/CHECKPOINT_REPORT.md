# Checkpoint 2 Report — TeamGoo Ticket Marketplace

## 1. Project Identity

**Project:** Blockchain Ticket Marketplace  
**Team:** Joey Contreras, Lupe Campos  
**Live App:** https://teamgoo.didlab.org  
**Repository:** https://github.com/lc6cm/TeamGoo-BlockChainProject  
**Network:** DIDLab, Chain ID `252501`

## 2. Problem, Stakeholders, and Trust Boundaries

Ticket buyers and sellers need to verify ticket ownership, transfers, authenticity, and redemption status.

**Stakeholders:** Issuers, buyers, sellers, event operators, and marketplace operators.

Blockchain records are publicly verifiable. Personal information, ticket files, and QR codes remain off-chain. Real-world issuance and redemption still depend on authorized participants.

## 3. Suitability Verdict

**Verdict: PROCEED WITH REDESIGN**

Blockchain provides a shared, verifiable record of ticket ownership, transfers, listings, and redemption. However, it cannot independently verify real-world ticket authenticity or scanning events.

## 4. Architecture

The application uses a web frontend, ethers.js, MetaMask, a Solidity smart contract, and DIDLab RPC.

The frontend reads contract state and submits wallet-authorized transactions. The contract manages ticket ownership, purchases, resale listings, cancellation, and redemption.

## 5. On-Chain / Off-Chain Data

**On-chain:** Ticket IDs, ownership, listing prices, redemption status, and authorized addresses.

**Off-chain:** Personal information, payment information, ticket files, and QR codes.

## 6. Deployment Record

- **Network:** DIDLab
- **Chain ID:** `252501`
- **Contract:** `TicketMarketplace`
- **Address:** `0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6`
- **Deployment transaction:** `0x8016127577e2a64eac0c1f7869f9142bbd0869c281a7faba7bff6eb6547ff833`
- **Deployment script:** `scripts/deploy.js`

The deployment script authorizes the deployer as issuer and operator and creates sample Ticket #1.

## 7. Features Completed

- MetaMask wallet connection and network detection.
- Live ticket information read from DIDLab.
- Primary ticket purchase.
- Resale listing and cancellation.
- Contract address displayed on the website.

Ticket #1 was purchased, listed for resale at `0.02` DIDLab tokens, and returned to the owner's wallet after cancellation.

**Evidence to attach:** Website screenshots and transaction hashes for the purchase, resale, and cancellation.

## 8. Testing Evidence

The most recent recorded test run had **18 passing tests** across `ProjectAnchor` and `TicketMarketplace`.

**All Tests Passing for Ticket Marketplace**

![Compile Succeeded](images/TicketTests.png)

**Ticket Bought**

![Compile Succeeded](images/TicketBought.png)

**Ticket Being Resold**

![Compile Succeeded](images/TicketResale.png)

**Ticket Resale Canceled**

![Compile Succeeded](images/TicketResaleCancel.png)

## 9. Security and Privacy Review

*Reserved for Checkpoint 3.*

## 10. Performance Measurements

*Reserved for Checkpoint 3.*

## 11. AI Development Record

ChatGPT assisted with understanding requirements, Solidity and Git concepts, debugging, documentation, testing, deployment, and frontend integration. See `docs/AI_RECORD.md`.

## 12. Individual Contributions

**Joey Contreras:** DIDLab setup, smart contracts, tests, deployment, frontend integration, and evidence collection.

**Lupe Campos:** Repository ownership, project planning, and documentation.

Confirm contributions using Git history.

## 13. Risks and Blockers

The contract relies on authorized participants to report real-world issuance and redemption accurately. Earlier deployment and compiler compatibility issues were resolved.

## 14. Plan for Checkpoint 3

- Test the marketplace end to end with separate wallets.
- Ensure primary purchases and resale transactions work for other users.
- Display pending, confirmed, failed, and rejected transaction states.
- Handle missing wallets and incorrect networks.
- Extend automated tests for the new features.
- Complete security, privacy, and performance reviews.
- Ensure both team members contribute commits since Checkpoint 2.

## 15. Change Log

Since Checkpoint 1, the team implemented and deployed `TicketMarketplace`, added automated tests and deployment scripts, connected the frontend to live contract state, and executed primary purchase and resale transactions. These changes demonstrate the project's transition from planning to a working blockchain application.