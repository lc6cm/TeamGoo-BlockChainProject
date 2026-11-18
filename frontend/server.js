
const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const DatabaseSync = require("better-sqlite3");
const { ethers } = require("ethers");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = process.env.DATA_DIR ||
  path.join(__dirname, "..", "data");

const CONTRACT_ADDRESS =
  "0x98dEca57f98504fF09AcdBF1F2345ABF72EbA3c6";
const DIDLAB_RPC = "https://eth.didlab.org";
const CHAIN_ID = 252501;

const provider = new ethers.JsonRpcProvider(DIDLAB_RPC, CHAIN_ID);
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  [
    "function owner() view returns (address)",
    "function authorizedIssuers(address) view returns (bool)",
    "function authorizedOperators(address) view returns (bool)"
  ],
  provider
);

fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "teamgoo.db");
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    wallet_address TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    venue TEXT,
    event_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS event_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    ticket_id TEXT NOT NULL,
    contract_address TEXT NOT NULL,
    chain_id INTEGER NOT NULL,
    UNIQUE (chain_id, contract_address, ticket_id),
    FOREIGN KEY (event_id) REFERENCES events(id)
  );
`);

// Durable reservations prevent duplicate IDs across concurrent issuer requests.
db.exec(`
  CREATE TABLE IF NOT EXISTS ticket_id_reservations (
    ticket_id TEXT PRIMARY KEY,
    issuer_address TEXT NOT NULL,
    event_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

app.use(express.json({ limit: "16kb" }));

// Temporary login challenges and sessions.
// They are held in server memory, not publicly accessible.
const challenges = new Map();
const sessions = new Map();

function normalizeAddress(address) {
  if (!ethers.isAddress(address)) {
    throw new Error("Invalid wallet address.");
  }
  return ethers.getAddress(address);
}

function cleanExpired() {
  const now = Date.now();

  for (const [key, value] of challenges) {
    if (value.expiresAt <= now) challenges.delete(key);
  }

  for (const [key, value] of sessions) {
    if (value.expiresAt <= now) sessions.delete(key);
  }
}

function createChallenge(address) {
  const nonce = crypto.randomBytes(32).toString("hex");

  const message = [
    "TeamGoo Administrator Login",
    "Sign this message to authenticate with TeamGoo.",
    "This does not authorize a blockchain transaction.",
    `Domain: ${process.env.AUTH_DOMAIN || "localhost:3000"}`,
    `Wallet: ${address}`,
    `Chain ID: ${CHAIN_ID}`,
    `Contract: ${CONTRACT_ADDRESS}`,
    `Nonce: ${nonce}`
  ].join("\n");

  challenges.set(nonce, {
    address,
    message,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  return { nonce, message };
}

async function requireAdmin(req, res, next) {
  try {
    cleanExpired();

    const header = req.get("Authorization") || "";
    const match = /^Bearer ([a-f0-9]{64})$/.exec(header);

    if (!match) {
      return res.status(401).json({
        error: "Administrator login required."
      });
    }

    const session = sessions.get(match[1]);

    if (!session) {
      return res.status(401).json({
        error: "Session expired. Please sign in again."
      });
    }

    // Always recheck ownership on-chain, including after revocation.
    const owner = await contract.owner();

    if (owner.toLowerCase() !== session.address.toLowerCase()) {
      sessions.delete(match[1]);
      return res.status(403).json({
        error: "Only the contract administrator can perform this action."
      });
    }

    req.adminAddress = session.address;
    next();
  } catch (error) {
    console.error("Administrator verification failed:", error);
    res.status(503).json({
      error: "Could not verify administrator permissions on DIDLab."
    });
  }
}


async function requireIssuer(req, res, next) {
  try {
    cleanExpired();

    const header = req.get("Authorization") || "";
    const match = /^Bearer ([a-f0-9]{64})$/.exec(header);

    if (!match) {
      return res.status(401).json({
        error: "Issuer login required."
      });
    }

    const session = sessions.get(match[1]);

    if (!session) {
      return res.status(401).json({
        error: "Session expired. Please sign in again."
      });
    }

    const authorized = await contract.authorizedIssuers(
      session.address
    );

    if (!authorized) {
      sessions.delete(match[1]);

      return res.status(403).json({
        error: "This wallet is not an authorized issuer."
      });
    }

    const organization = db.prepare(`
      SELECT id, name, wallet_address
      FROM organizations
      WHERE wallet_address = ?
    `).get(session.address.toLowerCase());

    if (!organization) {
      return res.status(403).json({
        error: "Your issuer wallet has not been registered to an organization."
      });
    }

    req.issuerAddress = session.address;
    req.organization = organization;

    next();
  } catch (error) {
    console.error("Issuer verification error:", error);

    res.status(503).json({
      error: "Could not verify issuer authorization."
    });
  }
}


// PUBLIC: Read organizations.
app.get("/api/organizations", (req, res) => {
  try {
    const organizations = db.prepare(`
      SELECT id, name, wallet_address
      FROM organizations
      ORDER BY name
    `).all();

    res.json({ organizations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load organizations." });
  }
});

// PUBLIC: Read events.
app.get("/api/events", (req, res) => {
  try {
    
const events = db.prepare(`
    SELECT
        events.id,
        events.organization_id,
        events.name,
        events.description,
        events.venue,
        events.event_date,
        organizations.name AS organization_name
    FROM events
    JOIN organizations
        ON events.organization_id = organizations.id
    ORDER BY events.id DESC
`).all();


    const eventsWithTickets = events.map(event => {
    const tickets = db.prepare(`
        SELECT ticket_id
        FROM event_tickets
        WHERE event_id = ?
          AND chain_id = ?
          AND contract_address = ?
        ORDER BY id
    `).all(
        event.id,
        CHAIN_ID,
        CONTRACT_ADDRESS.toLowerCase()
    );

    return {
        ...event,
        date: event.event_date,
        ticketIds: tickets.map(ticket => ticket.ticket_id)
    };
});

res.json({ events: eventsWithTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load events." });
  }
});

// STEP 1: Request a one-time message to sign.
app.post("/api/admin/challenge", (req, res) => {
  try {
    cleanExpired();

    const address = normalizeAddress(req.body?.address);

    // Limit outstanding challenges for each wallet.
    for (const [nonce, entry] of challenges) {
      if (entry.address.toLowerCase() === address.toLowerCase()) {
        challenges.delete(nonce);
      }
    }

    const challenge = createChallenge(address);
    res.json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// STEP 2: Verify the MetaMask signature.
app.post("/api/admin/login", async (req, res) => {
  try {
    cleanExpired();

    const { nonce, signature } = req.body || {};

    if (
      typeof nonce !== "string" ||
      typeof signature !== "string" ||
      !/^([a-f0-9]{64})$/.test(nonce)
    ) {
      return res.status(400).json({
        error: "Invalid authentication request."
      });
    }

    const challenge = challenges.get(nonce);

    if (!challenge) {
      return res.status(401).json({
        error: "Challenge missing or expired."
      });
    }

    // One-time use, even if verification fails.
    challenges.delete(nonce);

    const recoveredAddress = ethers.verifyMessage(
      challenge.message,
      signature
    );

    if (
      recoveredAddress.toLowerCase() !==
      challenge.address.toLowerCase()
    ) {
      return res.status(401).json({
        error: "Wallet signature does not match."
      });
    }

    const owner = await contract.owner();

    if (
      owner.toLowerCase() !==
      recoveredAddress.toLowerCase()
    ) {
      return res.status(403).json({
        error: "This wallet is not the contract administrator."
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    sessions.set(token, {
      address: recoveredAddress,
      expiresAt: Date.now() + 60 * 60 * 1000
    });

    res.json({
      token,
      address: recoveredAddress,
      expiresInSeconds: 3600
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(401).json({
      error: "Signature verification failed or DIDLab is unavailable."
    });
  }
});


// ISSUER: Request a message to sign.
app.post("/api/issuer/challenge", (req, res) => {
  try {
    cleanExpired();

    const address = normalizeAddress(req.body?.address);

    for (const [nonce, entry] of challenges) {
      if (entry.address.toLowerCase() === address.toLowerCase()) {
        challenges.delete(nonce);
      }
    }

    const challenge = createChallenge(address);

    res.json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ISSUER: Verify the signed message.
app.post("/api/issuer/login", async (req, res) => {
  try {
    cleanExpired();

    const { nonce, signature } = req.body || {};

    if (
      typeof nonce !== "string" ||
      typeof signature !== "string" ||
      !/^[a-f0-9]{64}$/.test(nonce)
    ) {
      return res.status(400).json({
        error: "Invalid authentication request."
      });
    }

    const challenge = challenges.get(nonce);

    if (!challenge) {
      return res.status(401).json({
        error: "Challenge missing or expired."
      });
    }

    challenges.delete(nonce);

    const recoveredAddress = ethers.verifyMessage(
      challenge.message,
      signature
    );

    if (
      recoveredAddress.toLowerCase() !==
      challenge.address.toLowerCase()
    ) {
      return res.status(401).json({
        error: "Wallet signature does not match."
      });
    }

    const authorized = await contract.authorizedIssuers(
      recoveredAddress
    );

    if (!authorized) {
      return res.status(403).json({
        error: "This wallet is not an authorized issuer."
      });
    }

    const organization = db.prepare(`
      SELECT id, name
      FROM organizations
      WHERE wallet_address = ?
    `).get(recoveredAddress.toLowerCase());

    if (!organization) {
      return res.status(403).json({
        error: "This wallet does not have a registered organization."
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    sessions.set(token, {
      address: recoveredAddress,
      role: "issuer",
      expiresAt: Date.now() + 60 * 60 * 1000
    });

    res.json({
      token,
      address: recoveredAddress,
      organization,
      expiresInSeconds: 3600
    });
  } catch (error) {
    console.error("Issuer login error:", error);

    res.status(401).json({
      error: "Issuer authentication failed."
    });
  }
});


// ADMIN ONLY: Register or update an organization.
app.post("/api/organizations", requireAdmin, async (req, res) => {
  try {
    const name = req.body?.name;
    const walletInput = req.body?.walletAddress;

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        error: "Organization name must contain 2–100 characters."
      });
    }

    const walletAddress = normalizeAddress(walletInput);

    // The issuer must actually be authorized by the contract.
    const authorized = await contract.authorizedIssuers(walletAddress);

    if (!authorized) {
      return res.status(403).json({
        error: "This wallet is not an authorized issuer on DIDLab."
      });
    }

    const result = db.prepare(`
      INSERT INTO organizations (name, wallet_address)
      VALUES (?, ?)
      ON CONFLICT(wallet_address)
      DO UPDATE SET name = excluded.name
    `).run(name.trim(), walletAddress.toLowerCase());

    res.json({
      success: true,
      organization: {
        name: name.trim(),
        walletAddress
      }
    });
  } catch (error) {
    console.error("Organization registration error:", error);

    if (error.message === "Invalid wallet address.") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({
      error: "Could not register organization."
    });
  }
});


// ISSUER ONLY: Create a new event.
app.post("/api/events", requireIssuer, (req, res) => {
  try {
    const { name, description, venue, eventDate } = req.body || {};

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 150
    ) {
      return res.status(400).json({
        error: "Event name must contain 2–150 characters."
      });
    }

    if (
      typeof description !== "string" ||
      description.trim().length > 2000
    ) {
      return res.status(400).json({
        error: "Description must be a string of at most 2000 characters."
      });
    }

    if (
      typeof venue !== "string" ||
      venue.trim().length < 2 ||
      venue.trim().length > 200
    ) {
      return res.status(400).json({
        error: "Venue must contain 2–200 characters."
      });
    }

    if (
      typeof eventDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) ||
      Number.isNaN(Date.parse(eventDate)) ||
      new Date(eventDate).toISOString().slice(0, 10) !== eventDate
    ) {
      return res.status(400).json({
        error: "Enter a valid event date in YYYY-MM-DD format."
      });
    }

    const result = db.prepare(`
      INSERT INTO events (
        organization_id,
        name,
        description,
        venue,
        event_date
      )
      VALUES (?, ?, ?, ?, ?)
    `).run(
      req.organization.id,
      name.trim(),
      description.trim(),
      venue.trim(),
      eventDate
    );

    res.status(201).json({
      success: true,
      event: {
        id: Number(result.lastInsertRowid),
        organizationId: req.organization.id,
        organizationName: req.organization.name,
        name: name.trim(),
        description: description.trim(),
        venue: venue.trim(),
        eventDate
      }
    });

  } catch (error) {
    console.error("Event creation error:", error);

    res.status(500).json({
      error: "Could not create event."
    });
  }
});


const ticketVerificationContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    [
        "function ticketInfo(uint256 tokenId) view returns (address ticketOwner, address issuer, uint256 primaryPrice, bool primaryListed, address secondarySeller, uint256 secondaryPrice, bool redeemed)",
        "event TicketMinted(uint256 indexed tokenId, address indexed issuer, uint256 price)"
    ],
    provider
);

// ISSUER ONLY: Associate a confirmed minted ticket with an event.
app.post("/api/events/:eventId/tickets", requireIssuer, async (req, res) => {
    try {
        const eventId = Number(req.params.eventId);
        const { ticketId, transactionHash } = req.body || {};

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({ error: "Invalid event ID." });
        }

        if (
            typeof ticketId !== "string" ||
            !/^[1-9]\d*$/.test(ticketId) ||
            BigInt(ticketId) >= (1n << 256n)
        ) {
            return res.status(400).json({ error: "Invalid ticket ID." });
        }

        if (!ethers.isHexString(transactionHash, 32)) {
            return res.status(400).json({ error: "Invalid transaction hash." });
        }

        // The event must belong to the authenticated organization.
        const event = db.prepare(`
            SELECT id, organization_id
            FROM events
            WHERE id = ? AND organization_id = ?
        `).get(eventId, req.organization.id);

        if (!event) {
            return res.status(403).json({
                error: "Event not found or does not belong to your organization."
            });
        }

        // Verify the transaction on DIDLab.
        const receipt = await provider.getTransactionReceipt(transactionHash);

        if (!receipt || receipt.status !== 1) {
            return res.status(400).json({
                error: "Mint transaction is not confirmed."
            });
        }

        if (
            !receipt.to ||
            receipt.to.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase() ||
            receipt.from.toLowerCase() !== req.issuerAddress.toLowerCase()
        ) {
            return res.status(403).json({
                error: "Transaction was not submitted by this issuer to the marketplace."
            });
        }

        // Verify that this transaction actually minted the requested ticket.
        let matchingMint = false;

        for (const log of receipt.logs) {
            if (log.address.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
                continue;
            }

            try {
                const parsed = ticketVerificationContract.interface.parseLog(log);

                if (
                    parsed &&
                    parsed.name === "TicketMinted" &&
                    parsed.args.tokenId === BigInt(ticketId) &&
                    parsed.args.issuer.toLowerCase() ===
                        req.issuerAddress.toLowerCase()
                ) {
                    matchingMint = true;
                    break;
                }
            } catch (_) {
                // Ignore logs that do not match the expected event.
            }
        }

        if (!matchingMint) {
            return res.status(403).json({
                error: "Transaction does not prove this issuer minted the ticket."
            });
        }

        // Check the current on-chain ticket record.
        const ticket = await ticketVerificationContract.ticketInfo(
            BigInt(ticketId)
        );

        if (
            ticket.issuer.toLowerCase() !== req.issuerAddress.toLowerCase()
        ) {
            return res.status(403).json({
                error: "Ticket issuer does not match your wallet."
            });
        }

        const existing = db.prepare(`
            SELECT event_id
            FROM event_tickets
            WHERE chain_id = ?
              AND contract_address = ?
              AND ticket_id = ?
        `).get(CHAIN_ID, CONTRACT_ADDRESS.toLowerCase(), ticketId);

        if (existing) {
            if (existing.event_id === eventId) {
                return res.json({
                    success: true,
                    alreadyLinked: true,
                    eventId,
                    ticketId
                });
            }

            return res.status(409).json({
                error: "This ticket is already associated with another event."
            });
        }

        db.prepare(`
            INSERT INTO event_tickets (
                event_id, ticket_id, contract_address, chain_id
            )
            VALUES (?, ?, ?, ?)
        `).run(eventId, ticketId, CONTRACT_ADDRESS.toLowerCase(), CHAIN_ID);

        res.status(201).json({
            success: true,
            eventId,
            ticketId,
            transactionHash
        });

    } catch (error) {
        console.error("Ticket association error:", error);
        res.status(500).json({
            error: "Could not associate ticket with event."
        });
    }
});

// Reserve automatic IDs for an authenticated issuer and one of their events.
// Start from all historical on-chain mints, including tickets not linked in SQLite.
// Only advance the scanned block cursor after all log queries succeed.
const TICKET_DEPLOYMENT_BLOCK = 6361910;
let scannedMintBlock = TICKET_DEPLOYMENT_BLOCK - 1;
let highestMintedId = 0n;
let reservationQueue = Promise.resolve();

async function syncMintedIds() {
  const latest = await provider.getBlockNumber();
  const filter = ticketVerificationContract.filters.TicketMinted();
  let nextBlock = Math.max(TICKET_DEPLOYMENT_BLOCK, scannedMintBlock + 1);
  while (nextBlock <= latest) {
    const end = Math.min(nextBlock + 1999, latest);
    const logs = await ticketVerificationContract.queryFilter(filter, nextBlock, end);
    for (const log of logs) {
      const id = BigInt(log.args.tokenId);
      if (id > highestMintedId) highestMintedId = id;
    }
    scannedMintBlock = end;
    nextBlock = end + 1;
  }
}

app.post("/api/ticket-ids/reserve", requireIssuer, async (req, res) => {
  // Serialize allocation requests within this Node process.
  const previous = reservationQueue;
  let release;
  reservationQueue = new Promise(resolve => { release = resolve; });
  await previous;
  try {
    const eventId = Number(req.body?.eventId);
    const quantity = Number(req.body?.quantity);
    if (!Number.isSafeInteger(eventId) || eventId <= 0 ||
        !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: "Select an event and a quantity from 1 to 10." });
    }
    const event = db.prepare(
      "SELECT id FROM events WHERE id = ? AND organization_id = ?"
    ).get(eventId, req.organization.id);
    if (!event) {
      return res.status(403).json({ error: "Event does not belong to your organization." });
    }

    await syncMintedIds();
    // SQLite transaction makes reservations atomic across processes sharing this DB.
    db.exec("BEGIN IMMEDIATE");
    let ids;
    try {
      const rows = db.prepare("SELECT ticket_id FROM ticket_id_reservations").all();
      let highest = highestMintedId;
      for (const row of rows) {
        const id = BigInt(row.ticket_id);
        if (id > highest) highest = id;
      }
      // IDs are never recycled, even when a wallet rejects a mint.
      ids = [];
      const stmt = db.prepare(
        "INSERT INTO ticket_id_reservations (ticket_id, issuer_address, event_id) VALUES (?, ?, ?)"
      );
      for (let i = 0; i < quantity; i++) {
        const id = highest + BigInt(i + 1);
        if (id >= (1n << 256n)) throw new Error("Ticket ID range exhausted.");
        const textId = id.toString();
        stmt.run(textId, req.issuerAddress.toLowerCase(), eventId);
        ids.push(textId);
      }
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
    res.json({ ticketIds: ids });
  } catch (error) {
    console.error("Ticket ID reservation failed:", error);
    res.status(503).json({ error: "Could not reserve ticket IDs. Please retry." });
  } finally {
    release();
  }
});

// ADMISSION CODES: Wallet-authenticated, transfer-bound, server-secret-derived codes.
// IMPORTANT: DATA_DIR must be persistent and private on your hosting provider.
// The server never stores plaintext admission codes in SQLite.
const CODE_SECRET_PATH = path.join(DATA_DIR, "admission-secret.hex");
let codeSecret;
if (process.env.ADMISSION_CODE_SECRET) {
  if (!/^[a-fA-F0-9]{64,}$/.test(process.env.ADMISSION_CODE_SECRET)) {
    throw new Error("ADMISSION_CODE_SECRET must be at least 32 random bytes in hex.");
  }
  codeSecret = Buffer.from(process.env.ADMISSION_CODE_SECRET, "hex");
} else {
  if (!fs.existsSync(CODE_SECRET_PATH)) {
    fs.writeFileSync(CODE_SECRET_PATH, crypto.randomBytes(32).toString("hex"), { flag: "wx", mode: 0o600 });
  }
  codeSecret = Buffer.from(fs.readFileSync(CODE_SECRET_PATH, "utf8").trim(), "hex");
  if (codeSecret.length < 32) throw new Error("Admission secret is invalid.");
}

const admissionContract = new ethers.Contract(CONTRACT_ADDRESS, [
  "function ticketInfo(uint256 tokenId) view returns (address ticketOwner, address issuer, uint256 primaryPrice, bool primaryListed, address secondarySeller, uint256 secondaryPrice, bool redeemed)",
  "function authorizedOperators(address) view returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
], provider);

// Transfer checkpoints avoid rescanning the full chain after every request.
// Only advance the checkpoint after successfully fetching the complete range.
db.exec(`CREATE TABLE IF NOT EXISTS admission_transfer_checkpoints (
  ticket_id TEXT PRIMARY KEY,
  scanned_block INTEGER NOT NULL,
  transfer_marker TEXT NOT NULL
)`);
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_CHUNK_BLOCKS = 2000;
const CODE_RATE_WINDOW = 60 * 1000;
const codeAttempts = new Map();

function validTicketId(value) {
  return typeof value === "string" && /^[1-9]\d*$/.test(value) && BigInt(value) < (1n << 256n);
}

function admitRateLimit(key, limit) {
  const now = Date.now();
  for (const [k, v] of codeAttempts) if (v.until <= now) codeAttempts.delete(k);
  const current = codeAttempts.get(key);
  if (!current || current.until <= now) {
    codeAttempts.set(key, { count: 1, until: now + CODE_RATE_WINDOW });
    return true;
  }
  if (current.count >= limit) return false;
  current.count++;
  return true;
}

// The last ERC-721 Transfer event acts as an ownership-generation marker.
// Listing, cancellation, secondary sale, and direct ERC-721 transfers all rotate codes.
// A first lookup searches backwards from the chain tip and stops as soon as
// the most recent transfer is found. Subsequent lookups scan only new blocks.
// In-flight requests for the same ticket share one lookup.
const transferLookupInFlight = new Map();
async function getTransferMarker(ticketId) {
  const inFlight = transferLookupInFlight.get(ticketId);
  if (inFlight) return inFlight;
  const lookup = (async () => {
    const existing = db.prepare(
      "SELECT scanned_block, transfer_marker FROM admission_transfer_checkpoints WHERE ticket_id = ?"
    ).get(ticketId);
    const latest = await provider.getBlockNumber();
    const filter = admissionContract.filters.Transfer(null, null, BigInt(ticketId));
    let marker = existing?.transfer_marker || "";
    if (existing) {
      // Scan forward to pick up any new transfers since the last checkpoint.
      let from = existing.scanned_block + 1;
      while (from <= latest) {
        const end = Math.min(from + CODE_CHUNK_BLOCKS - 1, latest);
        const logs = await admissionContract.queryFilter(filter, from, end);
        for (const log of logs) {
          marker = `${log.blockNumber}:${log.transactionHash}:${log.index}`;
        }
        db.prepare(`INSERT INTO admission_transfer_checkpoints (ticket_id, scanned_block, transfer_marker)
          VALUES (?, ?, ?) ON CONFLICT(ticket_id) DO UPDATE SET
          scanned_block = excluded.scanned_block, transfer_marker = excluded.transfer_marker`)
          .run(ticketId, end, marker);
        from = end + 1;
      }
    } else {
      // The most recent transfer defines the admission-code generation.
      // Scanning backwards avoids fetching years of irrelevant earlier logs.
      let end = latest;
      while (end >= TICKET_DEPLOYMENT_BLOCK) {
        const from = Math.max(TICKET_DEPLOYMENT_BLOCK, end - CODE_CHUNK_BLOCKS + 1);
        const logs = await admissionContract.queryFilter(filter, from, end);
        if (logs.length) {
          const last = logs[logs.length - 1];
          marker = `${last.blockNumber}:${last.transactionHash}:${last.index}`;
          break;
        }
        end = from - 1;
      }
      if (marker) {
        db.prepare(`INSERT INTO admission_transfer_checkpoints (ticket_id, scanned_block, transfer_marker)
          VALUES (?, ?, ?) ON CONFLICT(ticket_id) DO UPDATE SET
          scanned_block = excluded.scanned_block, transfer_marker = excluded.transfer_marker`)
          .run(ticketId, latest, marker);
      }
    }
    if (!marker) throw new Error("Could not establish ticket transfer history.");
    return marker;
  })();
  transferLookupInFlight.set(ticketId, lookup);
  try { return await lookup; }
  finally { transferLookupInFlight.delete(ticketId); }
}

function deriveAdmissionCode(ticketId, wallet, marker) {
  const digest = crypto.createHmac("sha256", codeSecret)
    .update(`${CHAIN_ID}|${CONTRACT_ADDRESS.toLowerCase()}|${ticketId}|${wallet.toLowerCase()}|${marker}`)
    .digest();
  // 12 base32 characters = 60 bits; no ambiguous O/0/I/1 characters.
  let bits = BigInt("0x" + digest.subarray(0, 8).toString("hex"));
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += CODE_ALPHABET[Number(bits & 31n)];
    bits >>= 5n;
  }
  return code.slice(0, 4) + "-" + code.slice(4, 8) + "-" + code.slice(8);
}

function createWalletChallenge(address) {
  const nonce = crypto.randomBytes(32).toString("hex");
  const message = [
    "TeamGoo Ticket Holder Login",
    "Sign to view your private admission codes.",
    "This does not authorize a blockchain transaction.",
    `Domain: ${process.env.AUTH_DOMAIN || "localhost:3000"}`,
    `Wallet: ${address}`,
    `Chain ID: ${CHAIN_ID}`,
    `Contract: ${CONTRACT_ADDRESS}`,
    `Nonce: ${nonce}`
  ].join("\n");
  challenges.set(nonce, { address, message, expiresAt: Date.now() + 5 * 60 * 1000, role: "holder" });
  return { nonce, message };
}

app.post("/api/holder/challenge", (req, res) => {
  try {
    cleanExpired();
    const address = normalizeAddress(req.body?.address);
    if (!admitRateLimit(`challenge:${req.ip}`, 20)) return res.status(429).json({ error: "Too many attempts. Try again later." });
    for (const [nonce, entry] of challenges) {
      if (entry.address.toLowerCase() === address.toLowerCase()) challenges.delete(nonce);
    }
    res.json(createWalletChallenge(address));
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.post("/api/holder/login", (req, res) => {
  try {
    cleanExpired();
    const { nonce, signature } = req.body || {};
    if (typeof nonce !== "string" || !/^[a-f0-9]{64}$/.test(nonce) || typeof signature !== "string") {
      return res.status(400).json({ error: "Invalid login request." });
    }
    const challenge = challenges.get(nonce);
    if (!challenge || challenge.role !== "holder") return res.status(401).json({ error: "Challenge expired or missing." });
    challenges.delete(nonce);
    const recovered = ethers.verifyMessage(challenge.message, signature);
    if (recovered.toLowerCase() !== challenge.address.toLowerCase()) return res.status(401).json({ error: "Wallet signature does not match." });
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { address: recovered, role: "holder", expiresAt: Date.now() + 60 * 60 * 1000 });
    res.json({ token, address: recovered, expiresInSeconds: 3600 });
  } catch (error) { res.status(401).json({ error: "Wallet authentication failed." }); }
});

function requireHolder(req, res, next) {
  cleanExpired();
  const match = /^Bearer ([a-f0-9]{64})$/.exec(req.get("Authorization") || "");
  const session = match && sessions.get(match[1]);
  if (!session || session.role !== "holder") return res.status(401).json({ error: "Ticket-holder wallet login required." });
  req.holderAddress = session.address;
  next();
}

app.get("/api/admission/:ticketId", requireHolder, async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    if (!validTicketId(ticketId)) return res.status(400).json({ error: "Invalid ticket ID." });
    if (!admitRateLimit(`holder:${req.holderAddress.toLowerCase()}`, 30)) return res.status(429).json({ error: "Too many requests." });
    const linked = db.prepare("SELECT event_id FROM event_tickets WHERE ticket_id = ? AND chain_id = ? AND contract_address = ?")
      .get(ticketId, CHAIN_ID, CONTRACT_ADDRESS.toLowerCase());
    if (!linked) return res.status(404).json({ error: "Ticket is not registered with TeamGoo." });
    const ticket = await admissionContract.ticketInfo(BigInt(ticketId));
    if (ticket.redeemed) return res.status(409).json({ error: "Ticket has already been redeemed." });
    if (ticket.ticketOwner.toLowerCase() !== req.holderAddress.toLowerCase()) {
      return res.status(403).json({ error: "Only the current on-chain owner can view the admission code. Listed tickets have no active code." });
    }
    const marker = await getTransferMarker(ticketId);
    // Re-read state after log scanning to avoid returning a code following a transfer.
    const current = await admissionContract.ticketInfo(BigInt(ticketId));
    if (current.redeemed || current.ticketOwner.toLowerCase() !== req.holderAddress.toLowerCase()) {
      return res.status(409).json({ error: "Ticket ownership or redemption status changed. Please retry." });
    }
    res.set("Cache-Control", "no-store");
    res.json({ ticketId, eventId: linked.event_id, admissionCode: deriveAdmissionCode(ticketId, req.holderAddress, marker) });
  } catch (error) {
    console.error("Admission code retrieval failed:", error);
    res.status(503).json({ error: "Could not verify ticket on DIDLab. Try again." });
  }
});

// Issuers may verify only tickets issued by their own wallet and linked to their events.
// This endpoint does not redeem on-chain; an authorized operator must sign redeemTicket() in MetaMask.
app.post("/api/redemption/verify", requireIssuer, async (req, res) => {
  try {
    const eventId = Number(req.body?.eventId);
    const supplied = req.body?.admissionCode;
    if (!Number.isSafeInteger(eventId) || eventId <= 0 || typeof supplied !== "string" ||
        !/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/.test(supplied.toUpperCase())) {
      return res.status(400).json({ error: "Select an event and enter a valid admission code." });
    }
    const key = `verify:${req.issuerAddress.toLowerCase()}:${req.ip}`;
    if (!admitRateLimit(key, 10)) return res.status(429).json({ error: "Too many verification attempts. Wait one minute." });
    const event = db.prepare("SELECT id, name FROM events WHERE id = ? AND organization_id = ?")
      .get(eventId, req.organization.id);
    if (!event) return res.status(403).json({ error: "Event does not belong to your organization." });
    if (!(await admissionContract.authorizedOperators(req.issuerAddress))) {
      return res.status(403).json({ error: "This issuer wallet is not authorized as a redemption operator." });
    }
    const rows = db.prepare(`SELECT ticket_id FROM event_tickets WHERE event_id = ? AND chain_id = ? AND contract_address = ?`)
      .all(eventId, CHAIN_ID, CONTRACT_ADDRESS.toLowerCase());
    if (rows.length > 500) return res.status(503).json({ error: "This event is too large for the current verification method." });
    const candidate = supplied.toUpperCase();
    for (const row of rows) {
      const ticket = await admissionContract.ticketInfo(BigInt(row.ticket_id));
      if (ticket.redeemed || ticket.ticketOwner.toLowerCase() === CONTRACT_ADDRESS.toLowerCase() ||
          ticket.issuer.toLowerCase() !== req.issuerAddress.toLowerCase()) continue;
      const marker = await getTransferMarker(row.ticket_id);
      const expected = deriveAdmissionCode(row.ticket_id, ticket.ticketOwner, marker);
      if (!crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expected))) continue;
      const fresh = await admissionContract.ticketInfo(BigInt(row.ticket_id));
      if (fresh.redeemed || fresh.ticketOwner.toLowerCase() !== ticket.ticketOwner.toLowerCase()) {
        return res.status(409).json({ error: "Ticket changed since verification. Try again." });
      }
      res.set("Cache-Control", "no-store");
      return res.json({ valid: true, ticketId: row.ticket_id, eventId, eventName: event.name, owner: ticket.ticketOwner, redeemed: false });
    }
    res.status(404).json({ valid: false, error: "Admission code is invalid, expired, listed for resale, or already redeemed." });
  } catch (error) {
    console.error("Admission verification failed:", error);
    res.status(503).json({ error: "Unable to verify admission code against DIDLab." });
  }
});

// Existing frontend remains unchanged.
app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
  console.log("TeamGoo server running!");
  console.log(`Website: http://localhost:${PORT}`);
  console.log(`Organizations: http://localhost:${PORT}/api/organizations`);
  console.log(`Events: http://localhost:${PORT}/api/events`);
  console.log(`Database: ${DB_PATH}`);
});
