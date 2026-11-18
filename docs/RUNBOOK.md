
# TeamGoo - Operational Runbook

## 1. Purpose

This runbook documents the procedures for deploying, operating, troubleshooting, and recovering the TeamGoo Blockchain Ticket Marketplace.

It is intended for developers, project maintainers, and course evaluators who need to understand how the application operates and how to restore it if problems occur.

TeamGoo is a course project deployed on the DIDLab blockchain.

Live application: https://teamgoo.didlab.org

Repository: https://github.com/lc6cm/TeamGoo-BlockChainProject

## 2. System Overview

TeamGoo is a blockchain-based ticket marketplace that supports:

- Ticket issuance by authorized organizations.
- Primary ticket purchases.
- Ticket resale and resale cancellation.
- Ticket ownership verification.
- Ticket admission and redemption.
- Administrator and issuer dashboards.
- MetaMask wallet integration.
- USD ticket price display with TRUST blockchain payments.

The application uses a web frontend to interact with Solidity smart contracts deployed on DIDLab.

The blockchain maintains ticket ownership, listing, transaction, and redemption state.

### Technology Stack

- Frontend: HTML, CSS, JavaScript.
- Blockchain interaction: ethers.js.
- Wallet: MetaMask.
- Smart contracts: Solidity.
- Development framework: Hardhat.
- Blockchain network: DIDLab.
- Local web server: Node.js and Express.
- Repository: GitHub.
- Hosting: DIDLab web hosting managed through cPanel.

## 3. Blockchain Configuration

Network name: DIDLab

Chain ID: 252501

Hexadecimal chain ID: 0x3da55

RPC URL: https://eth.didlab.org

Block explorer: https://explorer.didlab.org

Native currency: TRUST

### Deployed Contracts

TicketMarketplace:

0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6

TicketRecordRegistry:

0x2d8A3B142378f6dAd929c6aF73bD8c9C0d823963

The TicketMarketplace contract manages issuance, purchases, resale, ownership, and redemption.

The TicketRecordRegistry contract supports encrypted ticket record anchoring and verification. It is maintained as a separate component.

## 4. Repository Structure

Important project locations:

- contracts/ - Solidity smart contracts.
- test/ - Automated contract tests.
- scripts/ - Deployment and verification scripts.
- frontend/ - Local frontend application.
- frontend/server.js - Local Express server.
- frontend/public/index.html - Frontend implementation.
- public/index.html - Website deployment copy.
- docs/CHECKPOINT_REPORT.md - Cumulative project report.
- docs/AI_RECORD.md - AI development record.
- docs/RUNBOOK.md - Operational instructions.
- README.md - Project overview and setup instructions.
- hardhat.config.js - Hardhat configuration.

The frontend HTML files should remain synchronized when changes are deployed.

## 5. Prerequisites

The following software is required for local development:

- Node.js and npm.
- Git.
- MetaMask browser extension.
- A compatible web browser.
- Access to the TeamGoo GitHub repository.

Additional requirements for deployment:

- DIDLab hosting access.
- Permission to deploy the website through cPanel.
- Access to required environment configuration.
- A funded DIDLab wallet for blockchain transactions.

Smart contract redeployment additionally requires access to an authorized deployment wallet and sufficient TRUST for transaction fees.

Never share wallet private keys or seed phrases.

## 6. Local Setup

### Step 1: Clone the Repository

Open PowerShell or another terminal.

Run:

    git clone https://github.com/lc6cm/TeamGoo-BlockChainProject.git

    cd TeamGoo-BlockChainProject

### Step 2: Install Project Dependencies

From the repository root:

    npm install

### Step 3: Install Frontend Dependencies

Navigate to the frontend directory:

    cd frontend

    npm install

### Step 4: Start the Frontend

Run:

    npm start

Open the local address displayed by the server.

The frontend communicates with the deployed DIDLab smart contract.

A new smart contract deployment is not required for ordinary local frontend testing.

### Step 5: Connect MetaMask

Configure MetaMask with the DIDLab network settings from Section 3.

Connect the wallet to the local application.

Confirm that the application displays the connected wallet and retrieves ticket information.

## 7. Running Smart Contract Tests

From the repository root, install dependencies if necessary:

    npm install

Compile the Solidity contracts:

    npx hardhat compile

Run the complete test suite:

    npx hardhat test

The previously documented test results were:

- ProjectAnchor: 4 passing tests.
- TicketMarketplace: 15 passing tests.
- TicketRecordRegistry: 12 passing tests.

Total: 31 passing tests.

These results must be confirmed with a fresh test run before the final release.

If tests fail:

1. Read the terminal error output.
2. Confirm dependencies are installed.
3. Confirm the correct Node.js version is being used.
4. Check for recent changes to Solidity contracts or test files.
5. Recompile the contracts.
6. Rerun the failing tests.

Do not deploy contract changes until the relevant tests pass.

## 8. Frontend Deployment Procedure

The live TeamGoo website is hosted at:

https://teamgoo.didlab.org

Frontend deployment is managed through DIDLab cPanel.

### Step 1: Update the Frontend

Modify:

    frontend/public/index.html

If the change is intended for the live website, synchronize the deployment copy.

From the repository root, run:

    Copy-Item frontend/public/index.html public/index.html -Force

This command is intended for Windows PowerShell.

### Step 2: Verify the Files Match

Run:

    Get-FileHash frontend/public/index.html
    Get-FileHash public/index.html

Both files should have the same SHA256 hash.

### Step 3: Check for Whitespace Errors

Run:

    git diff --check -- frontend/public/index.html public/index.html

No output indicates that Git found no whitespace errors in those files.

### Step 4: Commit Changes

Stage the intended frontend files:

    git add frontend/public/index.html public/index.html

Commit:

    git commit -m "Update TeamGoo frontend"

Push:

    git push origin main

Check that the push succeeds before deploying.

### Step 5: Deploy Through DIDLab

1. Sign in to the DIDLab cPanel.
2. Open the TeamGoo application's deployment controls.
3. Select the deployment option for the latest repository changes.
4. Deploy the updated application.
5. Wait for the deployment operation to finish.
6. Open https://teamgoo.didlab.org.
7. Refresh the website and verify the changes.

Pushing to GitHub does not by itself guarantee that the live website has been updated.

### Step 6: Verify Deployment

After deployment:

- Confirm the website loads over HTTPS.
- Confirm the interface displays correctly.
- Connect MetaMask.
- Confirm DIDLab network detection works.
- Confirm blockchain ticket information loads.
- Confirm the Admin Dashboard appears for the administrator wallet.
- Confirm the Issuer Dashboard appears for an authorized issuer.
- Confirm ticket prices display in USD with two decimal places.
- Check the browser developer console for errors.

Do not consider deployment complete until the live website has been checked.

## 9. Smart Contract Deployment and Recovery

The marketplace uses an existing deployed TicketMarketplace contract.

Contract address:

0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6

Routine frontend updates do not require redeploying this contract.

### Before Redeploying

1. Confirm that a new contract deployment is necessary.
2. Review the Solidity changes.
3. Run the complete automated test suite.
4. Confirm that the deployment wallet is funded.
5. Review the Hardhat network configuration.
6. Back up the current contract address and deployment transaction.
7. Confirm that no private keys are committed to Git.

### Redeployment Procedure

From the repository root:

    npm install

    npx hardhat compile

    npx hardhat test

Review the deployment script:

    scripts/deploy.js

Review the network configuration:

    hardhat.config.js

The existing deployment procedure uses Hardhat and DIDLab.

The exact deployment command must match the current script and network configuration.

A typical Hardhat deployment command is:

    npx hardhat run scripts/deploy.js --network didlab

Use this command only after confirming that the configured network name is "didlab" and the script is intended to deploy the correct contract.

### After Redeployment

1. Record the new contract address.
2. Record the deployment transaction hash.
3. Verify the transaction on the DIDLab explorer.
4. Update the contract address in the frontend.
5. Update any relevant ABI references.
6. Reconfigure required issuer and operator permissions.
7. Confirm the new contract works using test wallets.
8. Deploy the updated frontend.
9. Update the README and checkpoint documentation.

Important: Redeploying a smart contract creates a new contract instance.

Existing ticket ownership and redemption state do not automatically transfer to the new contract.

For this reason, redeployment should not be used as a routine troubleshooting step.

## 10. Operational Verification

The application should be checked after deployment and before presentations or grading deadlines.

### Website Availability

Open:

https://teamgoo.didlab.org

Confirm that:

- The website loads.
- HTTPS is working.
- Navigation functions correctly.
- Ticket information appears.
- No JavaScript errors prevent operation.

### Wallet Connection

1. Open the website in a browser with MetaMask.
2. Connect a test wallet.
3. Confirm the wallet address is recognized.
4. Confirm the application detects the DIDLab network.
5. Verify that incorrect-network handling works.

### Blockchain Read Verification

Confirm that ticket ownership and status information are retrieved from the deployed contract.

The blockchain explorer can be used to independently inspect the contract and transactions.

### Blockchain Write Verification

Using a funded test wallet and an eligible ticket:

1. Initiate an appropriate ticket transaction.
2. Approve it in MetaMask.
3. Record the transaction hash.
4. Wait for confirmation.
5. Confirm the frontend updates.
6. Verify the transaction using the DIDLab explorer.

Use an appropriate test ticket to avoid modifying tickets needed for demonstrations.

### Transaction Error Handling

Check that the frontend handles:

- Missing MetaMask.
- Incorrect blockchain network.
- User-rejected transactions.
- Pending transactions.
- Successful confirmations.
- Reverted transactions.
- Invalid ticket states.

## 11. Troubleshooting

### Problem: Website Does Not Load

Possible causes:

- DIDLab hosting outage.
- Failed deployment.
- Incorrect deployment configuration.
- Missing frontend files.

Recovery steps:

1. Confirm the URL is correct.
2. Check whether DIDLab hosting is available.
3. Open the cPanel deployment controls.
4. Review deployment status and available logs.
5. Verify that public/index.html exists in the deployed application.
6. Redeploy the last known working frontend version if necessary.
7. Test the website again.

### Problem: MetaMask Does Not Connect

Possible causes:

- MetaMask is not installed.
- Wallet is locked.
- User rejected the connection request.
- Browser extension permissions are restricted.

Recovery steps:

1. Confirm MetaMask is installed.
2. Unlock the wallet.
3. Refresh the page.
4. Attempt the connection again.
5. Review the browser console if the problem continues.

### Problem: Wrong Blockchain Network

The application requires DIDLab chain ID 252501.

Recovery steps:

1. Open MetaMask.
2. Select the DIDLab network.
3. Verify the RPC URL and chain ID.
4. Refresh the website.
5. Reconnect the wallet if necessary.

### Problem: Ticket Information Does Not Load

Possible causes:

- DIDLab RPC is unavailable.
- Incorrect contract address.
- Network mismatch.
- JavaScript error.
- Contract call failure.

Recovery steps:

1. Confirm MetaMask is connected to DIDLab.
2. Verify the RPC URL.
3. Verify the deployed contract address.
4. Open the browser developer console.
5. Review errors from ethers.js.
6. Check the contract using the DIDLab explorer.
7. Retry after confirming blockchain connectivity.

### Problem: Transaction Fails

Possible causes:

- Insufficient TRUST balance.
- User rejected the transaction.
- Ticket is unavailable.
- Caller lacks required permissions.
- Incorrect payment amount.
- Ticket has already been redeemed.
- Smart contract rejected the operation.

Recovery steps:

1. Read the frontend transaction message.
2. Check the wallet's TRUST balance.
3. Confirm the ticket's current state.
4. Confirm the wallet has the required permissions.
5. If a transaction hash exists, inspect it on the explorer.
6. Check whether the receipt status indicates success or failure.
7. Correct the underlying issue before retrying.

A wallet-rejected transaction normally does not create an on-chain transaction hash.

### Problem: Issuer Dashboard Does Not Appear

Possible causes:

- The connected wallet is not an authorized issuer.
- The wrong wallet is connected.
- Network detection failed.
- Authorization information did not load.

Recovery steps:

1. Confirm the connected wallet address.
2. Confirm the DIDLab network.
3. Use the administrator wallet to check issuer authorization.
4. Authorize the issuer if appropriate.
5. Refresh the application.

### Problem: Admin Dashboard Does Not Appear

The Admin Dashboard is restricted to the TicketMarketplace contract owner.

Recovery steps:

1. Confirm the connected wallet.
2. Compare the wallet address with the contract owner.
3. Confirm DIDLab network connectivity.
4. Refresh the application.

Do not bypass authorization checks in the frontend.

### Problem: Ticket Redemption Fails

Possible causes:

- Invalid admission information.
- Ticket already redeemed.
- Wallet lacks redemption permissions.
- Incorrect ticket ID.
- Blockchain transaction failure.

Recovery steps:

1. Confirm the ticket exists.
2. Check the current redemption state.
3. Verify admission information.
4. Confirm the connected wallet is authorized.
5. Inspect the transaction result.
6. Retry only after correcting the cause.

Do not manually override on-chain redemption status.

### Problem: USD Price Displays Incorrectly

The frontend uses a fixed conversion rate:

0.01 TRUST = $10.00 USD

Prices are formatted with two decimal places.

Recovery steps:

1. Inspect the USD conversion functions.
2. Confirm the fixed conversion rate has not changed unintentionally.
3. Confirm displayed prices use two-decimal formatting.
4. Confirm transaction values are converted to TRUST correctly.
5. Verify both frontend HTML files contain the same implementation.
6. Redeploy the corrected frontend.

## 12. Rollback Procedure

If a new frontend deployment introduces a defect, return to a previously working version.

### Step 1: Identify the Last Working Commit

Run:

    git log --oneline -10

Identify the last known working commit.

### Step 2: Restore the Previous Frontend

Use Git to retrieve the known working frontend files.

For example:

    git restore --source=<commit-hash> -- frontend/public/index.html public/index.html

Replace <commit-hash> with the actual commit identifier.

Review the restored files before committing.

### Step 3: Commit the Rollback

Run:

    git add frontend/public/index.html public/index.html

    git commit -m "Restore previous working frontend"

    git push origin main

### Step 4: Redeploy

Deploy the restored version through DIDLab cPanel.

Verify that the live website works again.

This procedure restores frontend files only. It does not reverse blockchain transactions or restore previous smart contract state.

## 13. Security Procedures

### Private Key Protection

- Never commit private keys or seed phrases.
- Never place private keys in frontend JavaScript.
- Never share administrator wallet credentials.
- Store deployment credentials outside the repository.
- Keep encryption keys separate from public IPFS records.
- Review Git changes before committing.

### Access Control

The TicketMarketplace contract restricts administrative and issuer operations.

Only authorized wallets should perform privileged actions.

Authorization must be enforced by the smart contract, not only by hiding frontend controls.

### Incident Response

If a wallet is suspected of being compromised:

1. Stop using the affected wallet.
2. Identify the wallet's current permissions.
3. Use an uncompromised administrator wallet to revoke issuer or operator permissions where possible.
4. Review recent transactions on the explorer.
5. Record affected ticket IDs and transactions.
6. Document the incident and any corrective action.

If the contract owner's wallet is compromised, recovery options depend on the deployed contract's ownership and administrative functions.

Do not assume that a compromised owner can always be replaced.

### Privacy

Do not store personal identifiers directly on-chain.

Wallet addresses and transaction records are publicly visible.

Encrypted ticket records should remain encrypted before uploading to IPFS.

Encryption keys must remain off-chain.

## 14. Known Limitations

The TeamGoo Ticket Marketplace is completed for the scope of the course project.

Known limitations include:

- Ticket prices use a fixed USD-to-TRUST conversion rate.
- The application requires MetaMask and DIDLab TRUST tokens.
- Real-world ticket authenticity depends on authorized issuers.
- Admission-code authentication would require additional hardening for commercial use.
- Wallet security depends on proper private key management.
- The TicketRecordRegistry is not fully integrated into the main marketplace frontend.
- The application depends on DIDLab RPC and hosting availability.
- Blockchain transactions are not automatically reversible.
- Smart contract redeployment does not automatically migrate existing tickets.
- Additional security auditing, accessibility testing, and scalability testing would be required for commercial deployment.

These limitations do not prevent the application from demonstrating its intended blockchain functionality.

## 15. Release Verification Checklist

Before Checkpoint 4 submission, confirm:

- [ ] Live website loads over HTTPS.
- [ ] Website works in a clean browser environment.
- [ ] MetaMask connects successfully.
- [ ] DIDLab network detection works.
- [ ] Ticket information loads from the blockchain.
- [ ] Primary ticket purchasing works.
- [ ] Ticket resale and cancellation work.
- [ ] Admin Dashboard works for the contract owner.
- [ ] Issuer Dashboard works for authorized issuers.
- [ ] Ticket admission and redemption work.
- [ ] Transaction failures and wallet rejection are handled.
- [ ] Browser console has no application-breaking errors.
- [ ] All automated tests pass.
- [ ] README and runbook are accurate.
- [ ] No secrets are committed to Git.
- [ ] Both team members have contributed commits.
- [ ] Checkpoint evidence records are complete.
- [ ] Release commit is tagged.
- [ ] Final deployment is verified.

This checklist should be completed using actual tests and observations.

## 16. Release and Feature Freeze

Checkpoint 4 deadline:

November 29, 2026 at 11:59 PM.

After the release candidate is finalized, no new features should be added.

The remaining time before the final presentation should be used for:

- Fixing defects identified during release verification.
- Finalizing the cumulative report.
- Preparing the poster.
- Preparing the pitch.
- Practicing the live demonstration.

The released application should remain stable and accessible at:

https://teamgoo.didlab.org

## 17. Operational Responsibility

The project team is responsible for:

- Maintaining the GitHub repository.
- Keeping documentation accurate.
- Protecting privileged wallet credentials.
- Verifying successful deployments.
- Monitoring application availability.
- Confirming blockchain transactions.
- Recording security issues and known limitations.

## 18. Project Status

Status: Completed for the course project.

TeamGoo demonstrates blockchain-based ticket issuance, purchasing, resale, ownership verification, and redemption through a publicly accessible application.

This runbook documents the operational procedures needed to maintain and recover the application during the course evaluation period.

The project is an academic prototype and is not represented as a production-ready commercial ticketing service.
