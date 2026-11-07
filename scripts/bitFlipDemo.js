
const fs = require("fs");
const crypto = require("crypto");

// Read the actual encrypted ticket record.
const original = fs.readFileSync("offchain/ticket-issuance.enc");

// Create a separate copy so the original stays unchanged.
const modified = Buffer.from(original);

// Flip exactly one bit in the first byte.
modified[0] ^= 0x01;

// Calculate both SHA-256 digests.
function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// Count the number of changed bits.
let changedBits = 0;

for (let i = 0; i < original.length; i++) {
  let difference = original[i] ^ modified[i];

  while (difference !== 0) {
    changedBits += difference & 1;
    difference >>>= 1;
  }
}

console.log("File bytes:", original.length);
console.log("Total file bits:", original.length * 8);
console.log("Bits changed:", changedBits);
console.log("Original SHA-256:", sha256(original));
console.log("Modified SHA-256:", sha256(modified));

// Save the modified copy for evidence.
// This file is NOT uploaded or anchored.
fs.writeFileSync("offchain/ticket-issuance-flipped.enc", modified);
