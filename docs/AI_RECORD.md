# AI Record — TeamGoo Ticket Marketplace

## Tools Used

- ChatGPT

## What We Asked For

- Help outlining and writing sections of `docs/PROPOSAL.md`.
- Help identifying stakeholders, assets, transactions, and blockchain suitability.
- Help understanding the B2 disqualifier analysis and C1 on-chain/off-chain data requirements.
- Help designing the smart contract sketch, scope commitment, and project milestones.
- Help understanding and developing the `ProjectAnchor.sol` and `TicketMarketplace.sol` contracts and their tests.
- Help creating and modifying the ticket marketplace frontend.
- Guidance connecting the frontend to DIDLab using ethers.js and MetaMask.
- Help implementing wallet connection, network detection, ticket information retrieval, and transaction status messages.
- Help implementing a `Transfer` event listener to refresh ticket information.
- Guidance testing pending, confirmed, reverted, and wallet-rejected transaction outcomes.
- Help organizing the repository, generating `frontend/abi.js`, configuring `server.js`, and reviewing `.gitignore`.
- Help running Hardhat tests and documenting the results.
- Help developing `TicketRecordRegistry.sol` with ADMIN, SUBMITTER, and VERIFIER roles.
- Guidance encrypting a ticket issuance record using AES-256-GCM and uploading it to IPFS.
- Help calculating SHA-256 hashes, retrieving files, and verifying their integrity.
- Help anchoring an encrypted record's digest and CID on DIDLab.
- Help demonstrating how changing one bit affects a file's hash.
- Guidance testing authorized and unauthorized wallet actions, self-verification, and role revocation.
- Help developing automated security tests and testing direct contract calls through the browser console.
- Help analyzing blockchain privacy, public data exposure, and administrative governance.
- Help preparing assignment evidence and documentation.

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

## How We Verified It

We reviewed AI-generated suggestions against the assignment requirements and our actual project implementation.

**Smart contracts and tests**

- Reviewed the Solidity contracts and their intended behavior.
- Compiled the contracts using Hardhat.
- Executed `npx hardhat test`.
- Confirmed that all 18 tests passed: 4 `ProjectAnchor` tests and 14 `TicketMarketplace` tests.
- Compiled and deployed `TicketRecordRegistry.sol` to DIDLab.
- Ran `npx hardhat test test/TicketRecordRegistry.test.js` and confirmed all 12 tests passed.
- Tested unauthorized anchoring, unauthorized verification, self-verification, nonexistent records, duplicate identifiers, revoked permissions, and invalid inputs.

**Frontend and blockchain integration**

- Opened the deployed website at `https://teamgoo.didlab.org`.
- Connected MetaMask to DIDLab (chain ID 252501).
- Retrieved Ticket #1 information from the deployed contract.
- Verified that the website displayed ownership, listing status, price, and redemption information.
- Completed a secondary ticket purchase and checked the confirmed transaction on the DIDLab block explorer.
- Verified that the frontend detected a `Transfer` event and refreshed ticket information.
- Tested wallet rejection and confirmed that no transaction was submitted.
- Verified an actual on-chain reverted transaction with receipt status `0` and no contract state change.
- Tested the frontend locally using `npm start` and confirmed that ticket information loaded successfully.

**Encryption and IPFS**

- Encrypted a ticket issuance record using AES-256-GCM.
- Uploaded the encrypted file to IPFS through Pinata.
- Retrieved the encrypted file and confirmed its size was 306 bytes.
- Calculated the SHA-256 hash and confirmed it matched the expected digest.
- Changed exactly one bit in the encrypted file and confirmed that the resulting SHA-256 hash was different.
- Verified that the encrypted file's hash matched the digest anchored on-chain.

**Registry and access control**

- Granted SUBMITTER permission to Wallet A and VERIFIER permission to Wallet B.
- Confirmed Wallet A successfully anchored a ticket issuance record.
- Confirmed Wallet B successfully verified the record.
- Checked the `RecordAnchored` and `RecordVerified` events using the DIDLab explorer.
- Confirmed Wallet A's self-verification attempt was rejected with `SelfVerification`.
- Confirmed Wallet C's unauthorized verification attempt was rejected with `NotAuthorized`.
- Revoked Wallet A's temporary VERIFIER role and confirmed the permission was removed.
- Tested a direct contract call from Wallet C through the browser console and confirmed the smart contract rejected it.

**Privacy and governance**

- Reviewed the fields exposed through contract storage, calldata, and events.
- Analyzed privacy risks involving record identifiers, wallet addresses, and IPFS CIDs.
- Reviewed the powers of the ADMIN role and possible safeguards such as multi-signature wallets and timelocks.

**Repository**

- Created the required `frontend/` structure containing `server.js`, `package.json`, `abi.js`, and `public/index.html`.
- Generated the ABI from the compiled `TicketMarketplace` artifact and checked that the required functions and events were present.
- Reviewed `.gitignore` to ensure `.env` and generated development files were excluded.
- Checked Git history for obvious private-key exposure.
- Kept the encryption recovery key and local off-chain files out of Git.

## What It Got Wrong

Some initial AI-generated proposal content was too general and required revision. In particular, the B2 D4 analysis initially did not sufficiently explain who could falsify critical information and how that information entered the system.

The AI also suggested wording and implementation steps before all repository details had been verified. We checked the actual source files, contract behavior, and test output rather than assuming the suggestions were correct.

During repository organization, one suggested PowerShell command was accidentally combined with another, causing an error. The commands were separated and rerun successfully.

The initial ABI verification search did not return results because it assumed a particular JSON spacing format. A broader search confirmed that the required functions and events were present.

The reverted-transaction verification feature retrieves the receipt of an existing failed transaction rather than submitting the failed transaction through that feature. We verified the actual on-chain failure separately.

Some suggested commands needed corrections because PowerShell and the Hardhat JavaScript console use different syntax.

The AI initially suggested editing `AI_RECORD.md` at the repository root instead of the existing file in `docs/`.

The AI also initially treated the frontend's hidden ticket actions as proof of registry role enforcement. We clarified that the smart contract enforces authorization independently of the frontend.

We verified all important results using actual contract calls, transaction receipts, file hashes, and automated tests rather than relying only on AI explanations.

## How AI Was Used

AI was used as a development and learning assistant for explanations, code suggestions, troubleshooting, testing procedures, and documentation. The team reviewed the suggestions, executed the commands, tested the implementation, and verified blockchain results before using them as project evidence.

For the registry assignment, AI also helped with encryption, IPFS storage, SHA-256 verification, access-control testing, privacy analysis, and governance documentation. The team independently verified the contract behavior and security test results.