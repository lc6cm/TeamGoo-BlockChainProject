# AI Development Record

## Tools Used

* ChatGPT

## What We Asked For

During this week's work, I used ChatGPT to help understand the M1 Project Proposal requirements and organize the project documentation. I asked for:

* An outline of the required sections for `docs/PROPOSAL.md`.
* Help identifying the stakeholders, assets, transactions, and other information for Activity 3 and Part A2 based on the team's initial problem document.
* Help understanding what information belongs in the B2 disqualifier analysis.
* Help converting information from Activity 7 into the C1 on-chain/off-chain data section.
* Help creating and explaining a contract sketch for the ticket ownership and resale project.
* Help understanding the purpose of the C2 contract sketch and C3 scope commitment.
* Ideas for project milestones for Part E that fit the ticket ownership and resale project.
* Help formatting evidence for the D3 compiled contract and passing tests section.

## What It Produced

ChatGPT produced suggested Markdown content and explanations for several sections of the M1 proposal, including:

* A1–A3 and B1–B3 proposal structure and content.
* B2 disqualifier analysis.
* C1 on-chain/off-chain data organization.
* A contract sketch describing ticket state, state-changing functions, authorized callers, events, and out-of-scope functionality.
* An explanation of the contract sketch and scope commitment.
* Suggested milestones for M2 through M5.
* Suggested wording and structure for D3 evidence showing compilation, passing tests, and the DIDLab chain ID.

ChatGPT also helped explain the `ProjectAnchor.sol` requirements and the purpose of the associated tests.

## How You Verified It

I reviewed the generated proposal content against the M1 assignment requirements and the team's actual ticket resale problem. I also checked the contract and tests in the repository rather than assuming the generated code was correct.

For the Solidity contract, I verified that `ProjectAnchor.sol`:

* Stores a `bytes32` commitment and update timestamp.
* Sets the deployer as the owner.
* Restricts the `anchor()` function to the owner.
* Rejects an empty commitment using a custom error.
* Emits the required `CommitmentAnchored` event with indexed parameters.
* Provides a read function returning the commitment and timestamp.

## What It Got Wrong

Some of the initial AI-generated material was too general and required correction or additional consideration before being used. In particular, the B2 D4 analysis initially did not explicitly identify who could falsify each critical fact without detection. I recognized that the assignment specifically requires a detailed explanation of how each critical fact enters the system, who reports it, and who could falsify it.

The AI also initially suggested proposal wording before all repository details had been verified. I therefore checked the actual contract, test files, repository structure, and terminal results before treating those parts as verified.

The AI-generated Solidity and test code was not treated as automatically correct. The contract was checked against the assignment requirements, compiled with Hardhat, and tested successfully before being used as evidence.
