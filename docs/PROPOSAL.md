# M1 Project Proposal

## Part A — Problem Definition and Stakeholders

### A1 — Problem Statement
Ticket buyers and sellers in peer to peer resales must rely on ticket issuers or resale platforms to determine if a ticket is authentic, who owns it, if it has been transferred, and if it has been redeemed. When these records are in the hands of a central institution, buyers can have difficulty verifying the ticket's characteristics. This allows counterfeiting, unauthorized transfers, and financial loss. Sellers and buyers also need to rely on the platform to maintain ownership and transaction records. This is a problem because ticket sellers and resale platforms need to figure out how to protect private info while maintaining records of ownership, transactions, authentication, and redemption.

### A2 — Stakeholders, Assets, and Transactions

| Category                    | Description                                                                                                                                                                                                                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stakeholders                | **Ticket buyer:** purchases a ticket and needs to verify its ownership and status. **Ticket reseller:** owns a ticket and initiates a resale or transfer. **Ticket issuer:** creates and authorizes tickets and needs to maintain their authenticity. **Resale platform:** facilitates transactions and records ticket ownership and transfer information. |
| Assets                      | Event tickets and the associated ownership, transfer history, authenticity status, and redemption status.                                                                                                                                                                                                                                                  |
| State-changing transactions | **Ticket issuance:** initiated by the ticket issuer. **Ticket resale/transfer:** initiated by the current ticket owner and finalized by the buyer. **Redemption:** initiated by the event organization when a ticket is scanned and used for entry.                                                                                                        |
| Current intermediary        | The ticket issuer or resale platform maintains the centralized record of ticket ownership, authenticity, transfers, and redemption status.                                                                                                                                                                                                                 |
| What can go wrong           | Buyers may receive counterfeit or duplicated tickets, purchase tickets from someone who does not have legitimate ownership, or encounter tickets that have already been redeemed. This can result in financial loss and disputes between buyers, sellers, and the platform.                                                                                |

### A3 — Trust Boundary Diagram

![Trust Boundary Diagram](images/TrustBoundaryDiagram.png)

## Part B — Suitability Gate

### B1 — Suitability Questions

**Q1. Do multiple parties who do not fully trust each other act on the same data?**

Yes. Ticket buyers, sellers, ticket suppliers, and resale platforms all work with info about ticket ownership, authenticity, history, and redemption status.

**Q2. Do multiple parties need to write to the shared data, rather than only read it?**

Yes. Multiple parties need to make changes to the ticket's data, such as redemptions status, authenticity, transfers, and history. 

**Q3. Is the intermediary's cost, delay, failure, or control itself part of the problem?**

Yes. The current system depends on a ticket supplier or resale platform to maintain records of tickets. This means that other stakeholders are dependant on these institutions, and cannot verify independently.

**Q4. Does someone need to verify a claim without trusting the claimant or their private system?**

Yes. A buyer needs to determine whether a seller actually has a valid ticket and if that ticket has been already transferred or redeemed without relying on the seller's word. A public record of this information can be helpful to verify independently.

**Q5. Does the record need to remain tamper-evident after the fact?**

Yes. Ticket ownership and transfer records may need to be reviewed at another time to resolve conflicts involving duplicate tickets, redemption, and more. A tamper-evident history would help to verify that changes have not been modifed.

### B2 — Disqualifiers

**D1. Does the system require confidential content to be stored on chain?**

**State: No.** Confidential information such as buyer or seller names, contact information, payment information, and private ticket details will remain off chain. The blockchain will only contain information necessary to verify ticket ownership, transfers, authorization, and redemption status, without storing personal identifiers.

**D2. Does the system require throughput or finality beyond approximately 2-second blocks?**

**State: No.** Ticket ownership transfers and related state changes do not require extremely high transaction throughput or sub-second finality. The approximately 2-second block time available on DIDLab is sufficient for the expected transaction volume and use case.

**D3. Does the system require large data to be stored on chain?**

**State: No.** The actual ticket content, QR codes, files, and other large data will remain off chain. Only the small amount of state needed to verify ownership, transfers, authorization, and redemption will be recorded on chain.

**D4. Do all critical facts enter through a single unverifiable reporter?**

**State: Partially.** Ticket creation and initial authenticity information originate from the ticket issuer, while ownership changes are initiated by authorized ticket owners and accepted by buyers. Redemption status is different because the event's scanning system reports when a ticket is redeemed; the blockchain cannot independently determine whether a physical ticket was actually scanned, so a compromised or incorrect scanning system could report a false redemption status without the blockchain detecting that the underlying event did not occur.

**D5. Does the business process require records to be reversible or erasable?**

**State: No.** Ticket ownership and transfer history should remain available for later verification and dispute resolution. Corrections would be represented as new authorized transactions rather than deleting or rewriting previous records.

### B3 — Suitability Verdict

**Verdict: PROCEED WITH REDESIGN**

The ticket resale problem can possibly benefit from a blockchain system, but needs to be limited to the parts where shared, independent records can help. The system needs to allow authorized people to record and verify the different states of the tickets (ownership, history, etc) while keeping private information off chain. This design also needs to account that blockchain cannot independently verify if a physical ticket was scanned. Redemption must come from an event scanning system.

A third party with no access to any participant's private systems can verify the recorded ownership, transfer history, transfer authorization, and redemption status of a ticket by examining the publicly verifiable blockchain records and associated authorized transactions.

## Part C — Technical Scope and Data Model

### C1 — On-Chain and Off-Chain Data

| Data                         | On Chain                                   | Off Chain                                                          | Justification                                                                                                                                  |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Ticket identifier            | Ticket identifier or commitment            | Full ticket details and ticket file                                | A small identifier can be publicly verified without storing the full ticket on chain.                                                          |
| Ownership                    | Current authorized ownership address       | Personal information associated with the owner                     | Ownership needs to be publicly verifiable, while personal information must remain private.                                                     |
| Transfer history             | Transfer transactions and timestamps       | Private transaction details and personal information               | The history of ownership changes should be tamper-evident and independently verifiable.                                                        |
| Transfer authorization       | Authorized transfer records and signatures | Private keys and credentials                                       | The blockchain can verify that a transfer was authorized without exposing private credentials.                                                 |
| Redemption status            | Redemption state and redemption event      | Scanner data and other event-system details                        | The blockchain can preserve the recorded redemption status while the event's scanning system remains the source of the redemption information. |
| Ticket content               | None                                       | Ticket file, barcode, QR code, and other ticket details            | Large or sensitive ticket content does not need to be stored publicly on chain.                                                                |
| Buyer and seller information | None                                       | Names, emails, payment information, and other personal information | Personal identifiers and private information must not be stored on chain.                                                                      |

### C2 — Contract Sketch

The smart contract will maintain the publicly verifiable state of tickets and their ownership history while keeping private and large ticket information off chain.

**State and data types:**

* Ticket identifier: `bytes32`
* Current owner: `address`
* Ticket status: an enum representing states such as active, transferred, and redeemed
* Transfer history: records of previous ownership transfers and timestamps
* Authorized participants: addresses representing ticket issuers and other approved actors
* Redemption status: a boolean or status value indicating whether the ticket has been recorded as redeemed

**State-changing functions and callers:**

* `issueTicket()` — called by an authorized ticket issuer to create a ticket.
* `transferTicket()` — called by the current ticket owner to initiate an ownership transfer.
* `acceptTransfer()` — called by the intended buyer to accept a transfer.
* `redeemTicket()` — called by an authorized event representative or scanning system to record redemption.
* Authorization functions — called by an authorized administrator to add or remove approved participants.

**Events:**

* `TicketIssued` — announces the creation of a ticket and its authorized issuer.
* `TicketTransferInitiated` — announces that an owner has initiated a transfer.
* `TicketTransferred` — announces the completed ownership transfer.
* `TicketRedeemed` — announces that an authorized participant recorded the ticket as redeemed.
* Authorization events — announce changes to authorized participants.

Events should use indexed parameters where useful so that ticket activity can be efficiently located and independently verified.

**Deliberately does not do:**

* Store names, email addresses, payment information, or other personal identifiers on chain.
* Store ticket files, QR codes, or other large ticket content on chain.
* Process payments between buyers and sellers.
* Determine whether a physical ticket was genuinely scanned; it can only record redemption reported by an authorized event system.
* Replace the event issuer's or event venue's physical ticket-scanning infrastructure.
* Allow unauthorized participants to modify ticket ownership or status.

### C3 — Scope Commitment

By week 12, the team will implement a smart contract that will create, track, maintain ownership, authorize transfers, record history, and redemption status from an authorized source. The contract will only allow authorized users to change states of tickets. By week 14, the team will have a working system that shows ticket ownership, transfers, transfer history verification, and redemption status with a basic frontend to allow users to interact with the contract and view public information.

The project will NOT have real world payment processing, will not store personal information, private ticket information on chain, replace ticket scanning, guarantee that a redemption status is physically accurate, or integrate with an actual ticket provider.

## Part D — Repository / Compiled Contract

### D1 — Repository Foundation

The project repository is hosted on GitHub and contains the files and directories needed for Solidity development, testing, documentation, and future frontend work.

**Repository:** `https://github.com/lc6cm/TeamGoo-BlockChainProject`

**Repository structure:**

* `contracts/` — Solidity smart contracts.
* `test/` — automated contract tests.
* `scripts/` — deployment and project scripts.
* `docs/` — project documentation, including `PROPOSAL.md` and `TEAM_CHARTER.md`.
* `architecture/` — architecture diagrams and documentation.
* `decisions/` — architecture decision records.
* `frontend/` — frontend application files.
* `AI_RECORD.md` — record of AI assistance and verification.
* `README.md` — project overview and setup instructions.
* `.env.example` — names of required environment variables without key material.
* `.gitignore` — excludes `node_modules/`, `.env`, `artifacts/`, and `cache/`.

The repository will be used for version control throughout development, with each team member making substantive commits under their own account. The submitted `docs/PROPOSAL.md` will match the proposal submitted for the milestone.

**Graded commit hash:** To be added after the final M1 proposal commit is created.

### D2 — Team Contributions

| Team Member    | Number of Substantive Commits | Contribution                                                                                                  |
| -------------- | ----------------------------: | ------------------------------------------------------------------------------------------------------------- |
| Joey Contreras |                 2 | Initial github push with compiled contracts and tests, AI record |
| Lupe Campos    |                 1 | Proposal document|

### D3 — Compiled Contract and Passing Tests

The contract source and test file can be found under /contracts and /test folders respectively.

Compile succeeding
![Compile Succeed](images/HardHatCompile.png)

All tests passing
![All Tests Passing](images/HardhatTest.png)

Chain ID
![Chain ID](images/ChainID.png)

## Part E — Milestones and Team Charter

### E1 — Project Milestones

| Milestone                                     | Week | Planned Deliverable                                                                                                                                                                                                                                                                                      | Owner                                                                                                      |
| --------------------------------------------- | ---: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **M2 — Deployed Contract**                    |    6 | Deploy the initial ticket ownership contract to DIDLab, verify the deployment, and demonstrate basic ticket creation and ownership state. Complete the required contract tests and collect deployment evidence.                                                                                          | Joey — DIDLab operation and evidence; Lupe — repository management and contract review                     |
| **M3 — Vertical Slice**                       |    8 | Demonstrate the core ticket workflow: an authorized issuer creates a ticket, ownership is transferred from the current owner to a buyer, and the resulting ownership and transfer history can be read and verified. Establish the initial on-chain/off-chain data architecture.                          | Joey — contract deployment/testing and evidence; Lupe — repository integration and workflow implementation |
| **M4 — Security Review and Feature Complete** |   12 | Complete the core contract features, including authorization controls, ticket redemption status, ownership and transfer history, and validation of invalid or unauthorized operations. Complete a security-focused review and ensure the automated test suite covers the main success and failure cases. | Joey — DIDLab testing/evidence; Lupe — security review and repository integration                          |
| **M5 — Release Candidate and Freeze**         |   14 | Produce a release candidate with the working ticket workflow, basic frontend or interface, documentation, deployment information, and final test results. Resolve known issues and freeze the feature set for the final demonstration.                                                                   | Joey — final deployment/evidence; Lupe — release coordination and repository finalization                  |

### E2 — Team Charter

The team charter is under /docs with responsibilites and roles.