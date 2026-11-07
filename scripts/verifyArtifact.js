
const crypto = require("crypto");

const gatewayUrl =
  "https://gateway.pinata.cloud/ipfs/bafkreif6muweduc3z54kkpofwgwlq7htt4i4jmj66i75nfl7wns6mbbfma";

const expectedDigest =
  "be652c41d05bcf78a53dc5b1acb87cf39f11c4b13ef23fd6957fb365e6042560";

async function main() {
  // Retrieve the actual bytes stored on IPFS.
  const response = await fetch(gatewayUrl);

  if (!response.ok) {
    throw new Error(`Gateway returned HTTP ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());

  // Calculate SHA-256 from the retrieved bytes.
  const computedDigest = crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");

  const match = computedDigest === expectedDigest;

  console.log("Retrieved bytes:", bytes.length);
  console.log("Computed SHA-256:", computedDigest);
  console.log("Expected digest:", expectedDigest);
  console.log("match", match);

  if (!match) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
