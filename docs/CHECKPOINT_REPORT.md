# Checkpoint 1 Report

## 1. Project Identity

**Project:** Blockchain Ticket Marketplace  
**Team:** Joey Contreras, Lupe Campos  
**Live App:** https://teamgoo.didlab.org  
**Repository:** https://github.com/lc6cm/TeamGoo-BlockChainProject

## 2. Problem, Stakeholders, and Trust Boundaries

Ticket buyers and sellers may have difficulty verifying ticket authenticity, ownership, transfer history, and redemption status when these records are controlled by centralized platforms.

**Stakeholders:** Ticket issuers, primary buyers, secondary sellers, secondary buyers, event operators, and the marketplace operator.

**Trust boundary:** On-chain ticket records are publicly verifiable, while personal information, ticket files, QR codes, and other private data remain off chain. Real-world issuance and redemption still require authorized participants to report events accurately.

See `docs/PROPOSAL.md` for the detailed problem and trust-boundary analysis.

## 3. Suitability Verdict and Justification

**Verdict: PROCEED WITH REDESIGN**

The project is suitable for blockchain because participants need to verify shared ownership and transfer records without relying entirely on a single centralized record.

The main limitation is that blockchain cannot independently verify real-world facts such as whether an issuer truly authorized a ticket or whether a physical ticket was actually scanned. These facts will be reported by authorized participants.

**Verifier statement:**

> A third party with no access to any participant's private systems can verify the recorded ownership, transfer history, transfer authorization, and redemption status of a ticket by examining the publicly verifiable on-chain ticket records and the authorized transactions that changed them.

## 4. Architecture

The application will use:

- A web frontend for users.
- MetaMask for wallet connection and transaction authorization.
- A Solidity smart contract on DIDLab chain `252501`.
- On-chain ticket ownership, transfers, listings, and redemption status.
- Off-chain storage for private and large ticket information.
- An authorized event operator/scanner to report redemption.

## 5. On-Chain / Off-Chain Data Decisions

**On chain:**
- Ticket identifier
- Ownership
- Transfer history
- Listing information
- Redemption status
- Authorized issuer/operator addresses

**Off chain:**
- Names and contact information
- Payment information
- Ticket files and QR codes
- Other private or large ticket data

No personal identifiers are intended to be stored on chain.

## 11. AI Development Record

ChatGPT was used to help understand assignment requirements, organize proposal sections, develop project documentation, and explain Solidity, Git, and deployment concepts.

AI-generated material was reviewed against the assignment requirements and the actual repository, contract, tests, and deployment results.

See `docs/AI_RECORD.md` for details.

## 12. Individual Contributions

**Joey Contreras**
- DIDLab setup and operation
- ProjectAnchor contract and tests
- Checkpoint website deployment

**Lupe Campos**
- Repository ownership and merge authority
- Proposal and project planning
- Repository/project documentation

## 13. Risks, Blockers, and What Went Wrong

The main technical risk is reliance on authorized participants to report real-world issuance and redemption events accurately.

During deployment, the DIDLab Git deployment initially failed because the interface attempted to clone a GitHub `/tree/main` URL. The deployment succeeded after specifying the `main` branch and using the accepted repository URL format.

## 14. Plan for Next Checkpoint

- Implement the initial ticket NFT/ownership contract.
- Implement ticket creation and ownership transfer.
- Deploy and test the contract on DIDLab.
- Begin integrating the frontend with the blockchain.