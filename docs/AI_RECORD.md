# AI Record — TeamGoo Ticket Marketplace

## Tools Used

- ChatGPT

## What We Asked For

- Help outlining and writing sections of `docs/PROPOSAL.md`.
- Help identifying stakeholders, assets, transactions, and blockchain suitability.
- Help understanding the B2 disqualifier analysis and C1 on-chain/off-chain data requirements.
- Help designing the smart contract sketch, scope commitment, and project milestones.
- Help understanding and developing `ProjectAnchor.sol`, `TicketMarketplace.sol`, and their tests.
- Help creating and modifying the ticket marketplace frontend.
- Guidance connecting the frontend to DIDLab using ethers.js and MetaMask.
- Help implementing wallet connection, network detection, ticket information retrieval, and transaction status messages.
- Help implementing a `Transfer` event listener to refresh ticket information.
- Guidance testing pending, confirmed, reverted, and wallet-rejected transaction outcomes.
- Help organizing the repository, generating the frontend ABI, configuring `server.js`, and reviewing `.gitignore`.
- Help running Hardhat tests and documenting the results.
- Help developing `TicketRecordRegistry.sol` with ADMIN, SUBMITTER, and VERIFIER roles.
- Guidance encrypting a ticket issuance record using AES-256-GCM and uploading it to IPFS.
- Help calculating SHA-256 hashes, retrieving files, and verifying their integrity.
- Help anchoring an encrypted record's digest and CID on DIDLab.
- Help demonstrating how changing one bit affects a file's hash.
- Guidance testing authorized and unauthorized wallet actions, self-verification, and role revocation.
- Help developing automated security tests and testing direct contract calls through the browser console.
- Help reviewing reentrancy protection, access control, input validation, and invalid state transitions.
- Help analyzing blockchain privacy, public data exposure, and administrative governance.
- Guidance measuring transaction gas usage and confirmation latency.
- Help retrieving transaction receipts, block numbers, timestamps, and event topics.
- Help identifying exact Solidity event signatures using the contract ABI.
- Help verifying on-chain state after minting Ticket #999.
- Help preparing Checkpoint 1, 2, and 3 evidence Markdown files.
- Help updating the cumulative checkpoint report and preparing it for PDF export.
- Help preparing the Checkpoint 3 security, privacy, performance, and testing documentation.
- Help implementing an Admin Dashboard for managing authorized ticket issuers.
- Help restricting administrative controls to the smart contract owner.
- Help implementing an Issuer Dashboard for authorized organizations.
- Help connecting the dashboards to `owner()`, `authorizedIssuers()`, `setIssuer()`, and `mintTicket()`.
- Help implementing ticket minting directly through MetaMask and the frontend.
- Help validating ticket IDs and primary prices in TRUST.
- Help troubleshooting why newly minted tickets were not appearing in the marketplace.
- Guidance resolving GitHub push conflicts using Git rebase.
- Help updating the checkpoint report with Admin Dashboard and Issuer Dashboard screenshots.
- Help identifying remaining frontend features, including multiple-ticket display, event information, and an About page.

## What It Produced

ChatGPT provided:

- Suggested Markdown content for the M1 proposal, including A1–A3, B1–B3, C1–C3, D3, and project milestones.
- Explanations of smart contract functions, authorization, events, and blockchain data storage.
- Guidance for developing Solidity contracts and Hardhat tests.
- Frontend HTML and JavaScript suggestions using ethers.js.
- Instructions for connecting MetaMask and detecting incorrect networks.
- Transaction-handling logic displaying pending, confirmed, reverted, and rejected outcomes.
- Code suggestions for monitoring the `Transfer` event and refreshing ticket information.
- Instructions for checking transaction receipts and displaying an actual reverted transaction.
- PowerShell commands for organizing the `frontend/` directory and generating the contract ABI.
- Instructions for running and recording contract tests.
- Solidity code suggestions for the ticket record registry and role-based permissions.
- JavaScript scripts for encryption, IPFS retrieval, SHA-256 verification, and bit-flipping.
- Hardhat commands for deploying the registry, granting roles, revoking roles, and testing permissions.
- Instructions for decoding smart contract events and custom errors.
- Guidance for testing unauthorized contract calls through MetaMask and the browser console.
- Suggested privacy field enumeration and governance analysis content.
- Security review guidance covering access control, reentrancy, input validation, and residual risks.
- Hardhat console commands for measuring transaction submission and confirmation times.
- Commands for retrieving transaction receipts, gas usage, block timestamps, and emitted events.
- Commands for identifying event signatures and topic hashes from contract ABIs.
- Markdown tables summarizing performance measurements and automated testing results.
- Suggested content for `CP1_TeamGoo_evidence.md`, `CP2_TeamGoo_evidence.md`, and `CP3_TeamGoo_evidence.md`.
- Updated checkpoint report content covering security, privacy, performance, and additional development.
- Instructions for converting the checkpoint report from Markdown to PDF.
- HTML and JavaScript suggestions for the Admin Dashboard and Issuer Dashboard.
- Code for checking the connected wallet against the contract owner and authorized issuer mappings.
- Code for authorizing and revoking issuer wallets through MetaMask.
- JavaScript for minting tickets using ethers.js and converting TRUST prices to wei.
- Input validation for ticket IDs and prices.
- Transaction handling that waits for blockchain confirmation before reporting successful ticket minting.
- Explanations of how newly minted tickets are stored in marketplace escrow and listed for primary sale.
- Guidance identifying the hardcoded `TOKEN_ID = 1` limitation in the marketplace.
- PowerShell and Git commands for committing, rebasing, and pushing changes.
- Markdown documentation describing the dashboards, successful minting, screenshots, and remaining work.

## How We Verified It

We reviewed AI-generated suggestions against the assignment requirements and our actual project implementation.

### Smart Contracts and Tests

- Reviewed the Solidity contracts and their intended behavior.
- Compiled the contracts using Hardhat.
- Executed `npx hardhat test`.
- Confirmed that the complete test suite passed with 31 tests:
  - ProjectAnchor: 4 tests.
  - TicketMarketplace: 15 tests.
  - TicketRecordRegistry: 12 tests.
- Compiled and deployed `TicketRecordRegistry.sol` to DIDLab.
- Ran `npx hardhat test test/TicketRecordRegistry.test.js` and confirmed all 12 registry tests passed.
- Tested unauthorized anchoring, unauthorized verification, self-verification, nonexistent records, duplicate identifiers, revoked permissions, and invalid inputs.
- Reviewed the primary and secondary purchase functions for reentrancy risks.
- Tested a malicious issuer attempting a reentrant purchase during its payout callback.
- Confirmed the attempted reentrant purchase failed while the legitimate purchase succeeded.
- Recognized that existing ticket-state checks also prevent the repeated purchase, so the test does not isolate ReentrancyGuard as the only protection.

### Frontend and Blockchain Integration

- Opened the deployed website at https://teamgoo.didlab.org.
- Connected MetaMask to DIDLab (chain ID `252501`).
- Retrieved Ticket #1 information from the deployed contract.
- Verified that the website displayed ownership, listing status, price, and redemption information.
- Completed a secondary ticket purchase and checked the confirmed transaction on the DIDLab block explorer.
- Verified that the frontend detected a `Transfer` event and refreshed ticket information.
- Tested wallet rejection and confirmed that no transaction was submitted.
- Verified an actual on-chain reverted transaction with receipt status `0` and no contract state change.
- Tested the frontend locally using `npm start` and confirmed that ticket information loaded successfully.

### Admin Dashboard

- Connected the administrator wallet to DIDLab.
- Confirmed that the Admin Dashboard appeared for the contract owner.
- Implemented controls for checking issuer authorization.
- Successfully authorized two issuer wallets through the deployed contract.
- Confirmed that issuer authorization status was displayed in the frontend.

**Authorized issuer wallets:**

- `0x4F4c46350c75caAA2F88a37b7b83b8ec47949fA5`
- `0xD40963bf3d072203B607387339774c90730c1939`

The dashboard uses the contract's authorization functions rather than relying only on frontend controls.

### Issuer Dashboard

- Connected an authorized issuer wallet through MetaMask.
- Confirmed that the Issuer Dashboard appeared for the authorized wallet.
- Confirmed the authorization status showed "Authorized issuer."
- Entered Ticket ID `2` and a primary price of `0.01` TRUST.
- Submitted the minting transaction through MetaMask.
- Confirmed the frontend reported "Ticket #2 minted successfully!"

**Successful Ticket #2 minting:**

- Ticket ID: `2`
- Issuer: `0xD40963bf3d072203B607387339774c90730c1939`
- Primary price: `0.01` TRUST
- Transaction hash: `0xd7c82b2834f4dac49e0632e666a8d4d93ae01b0b3023de631705f7015c58ea46`

This demonstrated that an authorized organization could mint a ticket directly through the website without using the Hardhat console.

### Encryption and IPFS

- Encrypted a ticket issuance record using AES-256-GCM.
- Uploaded the encrypted file to IPFS through Pinata.
- Retrieved the encrypted file and confirmed its size was 306 bytes.
- Calculated the SHA-256 hash and confirmed it matched the expected digest.
- Changed exactly one bit in the encrypted file and confirmed that the resulting SHA-256 hash was different.
- Verified that the encrypted file's hash matched the digest anchored on-chain.

### Registry and Access Control

- Granted SUBMITTER permission to Wallet A and VERIFIER permission to Wallet B.
- Confirmed Wallet A successfully anchored a ticket issuance record.
- Confirmed Wallet B successfully verified the record.
- Checked the `RecordAnchored` and `RecordVerified` events using the DIDLab explorer.
- Confirmed Wallet A's self-verification attempt was rejected with `SelfVerification`.
- Confirmed Wallet C's unauthorized verification attempt was rejected with `NotAuthorized`.
- Revoked Wallet A's temporary VERIFIER role and confirmed the permission was removed.
- Tested a direct contract call from Wallet C through the browser console and confirmed the smart contract rejected it.

### Performance Measurements

We used the Hardhat console to measure an actual ticket minting transaction on DIDLab.

**Ticket #999 Minting Results:**

- Transaction hash: `0x3e8a0d6148c78e4264151ceb2cda8a22c0a59b89e65e50df2a1f302a9403522c`
- Submission latency: 0.412 seconds.
- Confirmation wait: 0.668 seconds.
- Total time: 1.080 seconds.
- Gas used: 149,022.
- Block number: 7,268,873.
- Receipt status: 1 (successful).

We also retrieved receipts for other transactions and recorded their gas usage.

| Operation | Gas Used |
|---|---:|
| Resale listing | 92,834 |
| Resale purchase | 44,293 |
| Ticket minting | 149,022 |
| Record anchoring | 185,361 |
| Record verification | 33,278 |

These values were obtained from transaction receipts rather than AI estimates.

The timing results represent one observed transaction and should not be interpreted as an average.

### On-Chain State Verification

After minting Ticket #999, we used contract calls to verify:

- Ticket #999 existed.
- The marketplace contract held the ticket in escrow.
- The issuer was Wallet A.
- The primary price was 0.01 TRUST.
- The ticket was available for primary purchase.
- The total ticket count increased from 1 to 2.

This confirmed that the transaction changed the deployed contract state.

### Event Signature Verification

We used the Hardhat console to inspect the deployed contracts' ABI event definitions.

Verified signatures included:

- `TicketListed(uint256,address,uint256)`
- `SecondaryTicketSold(uint256,address,address,uint256)`
- `TicketMinted(uint256,address,uint256)`
- `Transfer(address,address,uint256)`
- `RecordAnchored(bytes32,bytes32,string,address)`
- `RecordVerified(bytes32,address)`

We compared the minting, anchoring, and verification event topics with their transaction receipts.

The listing and purchase signatures were confirmed against the ABI, but their event topics were not separately matched to the corresponding receipts during this review.

### Privacy and Governance

- Reviewed the fields exposed through contract storage, calldata, and events.
- Analyzed privacy risks involving record identifiers, wallet addresses, and IPFS CIDs.
- Reviewed the powers of the ADMIN role and possible safeguards such as multi-signature wallets and timelocks.
- Documented residual risks involving privileged keys, operator redemption authority, encryption key compromise, and failed external payouts.

### Repository and Documentation

- Created the required `frontend/` structure containing `server.js`, `package.json`, the generated contract ABI, and `public/index.html`.
- Generated the ABI from the compiled `TicketMarketplace` artifact and checked that the required functions and events were present.
- Reviewed `.gitignore` to ensure `.env` and generated development files were excluded.
- Checked Git history for obvious private-key exposure.
- Kept the encryption recovery key and local off-chain files out of Git.
- Reviewed the cumulative checkpoint report for outdated information and formatting problems.
- Prepared separate Markdown evidence files for Checkpoints 1, 2, and 3.
- Documented transaction hashes, block numbers, gas usage, test results, and security evidence.
- Prepared the checkpoint report for conversion to PDF.
- Updated the checkpoint report with Admin Dashboard and Issuer Dashboard descriptions.
- Added screenshot references using the relative paths `images/Admin_Dashboard.png` and `images/Issuer_Dashboard.png`.
- Committed the frontend dashboard changes.
- Resolved a GitHub push conflict using `git pull --rebase origin main`.
- Successfully pushed commit `2ce074d` to the `main` branch.

## What It Got Wrong

Some initial AI-generated proposal content was too general and required revision. In particular, the B2 D4 analysis initially did not sufficiently explain who could falsify critical information and how that information entered the system.

The AI also suggested wording and implementation steps before all repository details had been verified. We checked the actual source files, contract behavior, and test output rather than assuming the suggestions were correct.

During repository organization, one suggested PowerShell command was accidentally combined with another, causing an error. The commands were separated and rerun successfully.

The initial ABI verification search did not return results because it assumed a particular JSON spacing format. A broader search confirmed that the required functions and events were present.

The reverted-transaction verification feature retrieves the receipt of an existing failed transaction rather than submitting the failed transaction through that feature. We verified the actual on-chain failure separately.

Some suggested commands needed corrections because PowerShell and the Hardhat JavaScript console use different syntax.

The AI initially suggested editing `AI_RECORD.md` at the repository root instead of the existing file in `docs/`.

The AI also initially treated the frontend's hidden ticket actions as proof of registry role enforcement. We clarified that the smart contract enforces authorization independently of the frontend.

During Checkpoint 3 documentation, the AI initially provided incomplete event signatures and marked some signatures as unverified. We inspected the actual contract ABI to identify the correct signatures and event topics.

The AI initially described some transaction evidence without complete receipt metadata. We retrieved the actual transaction receipts to confirm block numbers, gas usage, statuses, and timestamps.

Some report sections contained outdated checkpoint wording and test counts. These were updated to reflect the current implementation and 31 passing tests.

The team initially prepared a text-based checkpoint report but later added Admin Dashboard and Issuer Dashboard screenshots to document the new frontend functionality.

The AI initially suggested a screenshot path without confirming the report's directory. We clarified that image paths must be relative to the location of `CHECKPOINT_REPORT.md`.

The AI identified that the frontend currently uses a hardcoded `TOKEN_ID = 1`, meaning Ticket #2 does not automatically appear in the marketplace despite successful minting. Dynamic ticket display remains unfinished.

We verified important results using actual contract calls, transaction receipts, file hashes, and automated tests rather than relying only on AI explanations.

## How AI Was Used

AI was used as a development and learning assistant for explanations, code suggestions, troubleshooting, testing procedures, and documentation.

The team reviewed the suggestions, executed the commands, tested the implementation, and verified blockchain results before using them as project evidence.

For Checkpoint 3, AI also helped with security testing, performance measurements, transaction receipt analysis, event signature verification, encrypted IPFS records, role-based access control, privacy analysis, and documentation.

Additional AI assistance was used to implement administrator and issuer workflows, integrate ticket minting into the frontend, troubleshoot GitHub conflicts, and update the checkpoint report.

The team verified the Admin Dashboard and Issuer Dashboard using connected MetaMask wallets and confirmed successful ticket minting through DIDLab.

The remaining frontend work includes displaying multiple tickets, adding event information, creating an About page, implementing redemption controls, and integrating registry verification.

AI-generated code and explanations were not treated as proof of correctness. Contract behavior was checked through automated tests, live DIDLab transactions, and direct state verification.

The final implementation, evidence selection, and submission decisions remained the responsibility of the team.