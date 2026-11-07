
const fs = require("fs");
const crypto = require("crypto");

const input = fs.readFileSync("offchain/ticket-issuance.json");

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);

const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

const encrypted = Buffer.concat([
  cipher.update(input),
  cipher.final()
]);

const tag = cipher.getAuthTag();

// Store IV, authentication tag, and ciphertext together.
const output = Buffer.concat([iv, tag, encrypted]);

fs.writeFileSync("offchain/ticket-issuance.enc", output);

// Keep this recovery information private.
fs.writeFileSync(
  "offchain/recovery-key.txt",
  key.toString("hex")
);

console.log("Encrypted file created.");
console.log("Ciphertext bytes:", output.length);
console.log(
  "Ciphertext SHA-256:",
  crypto.createHash("sha256").update(output).digest("hex")
);
