
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketRecordRegistry", function () {
  let registry;
  let admin, submitter, verifier, outsider;

  const recordId = ethers.id("teamgoo-record-1");
  const digest = ethers.sha256(
    ethers.toUtf8Bytes("sample encrypted artifact bytes")
  );
  const cid = "bafybeigexamplecid";

  beforeEach(async function () {
    [admin, submitter, verifier, outsider] =
      await ethers.getSigners();

    const Registry = await ethers.getContractFactory(
      "TicketRecordRegistry"
    );

    registry = await Registry.deploy();
    await registry.waitForDeployment();

    const submitterRole = await registry.SUBMITTER_ROLE();
    const verifierRole = await registry.VERIFIER_ROLE();

    await registry.grantRole(submitterRole, submitter.address);
    await registry.grantRole(verifierRole, verifier.address);
  });

  it("allows an authorized submitter to anchor", async function () {
    await expect(
      registry.connect(submitter).anchorRecord(recordId, digest, cid)
    ).to.emit(registry, "RecordAnchored");

    const record = await registry.records(recordId);
    expect(record.exists).to.equal(true);
    expect(record.digest).to.equal(digest);
    expect(record.cid).to.equal(cid);
  });

  it("allows an independent verifier to verify", async function () {
    await registry.connect(submitter).anchorRecord(recordId, digest, cid);

    await expect(
      registry.connect(verifier).verifyRecord(recordId)
    ).to.emit(registry, "RecordVerified");

    const record = await registry.records(recordId);
    expect(record.verified).to.equal(true);
  });

  it("rejects anchoring without the submitter role", async function () {
    await expect(
      registry.connect(outsider).anchorRecord(recordId, digest, cid)
    ).to.be.revertedWithCustomError(registry, "NotAuthorized");
  });

  it("rejects verification without the verifier role", async function () {
    await registry.connect(submitter).anchorRecord(recordId, digest, cid);

    await expect(
      registry.connect(outsider).verifyRecord(recordId)
    ).to.be.revertedWithCustomError(registry, "NotAuthorized");
  });

  it("rejects self-verification", async function () {
    const verifierRole = await registry.VERIFIER_ROLE();
    await registry.grantRole(verifierRole, submitter.address);

    await registry.connect(submitter).anchorRecord(recordId, digest, cid);

    await expect(
      registry.connect(submitter).verifyRecord(recordId)
    ).to.be.revertedWithCustomError(registry, "SelfVerification");
  });

  it("rejects verification of a nonexistent record", async function () {
    await expect(
      registry.connect(verifier).verifyRecord(recordId)
    ).to.be.revertedWithCustomError(registry, "RecordNotFound");
  });

  it("rejects duplicate record identifiers", async function () {
    await registry.connect(submitter).anchorRecord(recordId, digest, cid);

    await expect(
      registry.connect(submitter).anchorRecord(recordId, digest, cid)
    ).to.be.revertedWithCustomError(registry, "DuplicateRecord");
  });

  it("rejects actions after a role is revoked", async function () {
    const submitterRole = await registry.SUBMITTER_ROLE();

    await registry.revokeRole(submitterRole, submitter.address);

    await expect(
      registry.connect(submitter).anchorRecord(recordId, digest, cid)
    ).to.be.revertedWithCustomError(registry, "NotAuthorized");
  });

  it("rejects an empty record identifier", async function () {
    await expect(
      registry.connect(submitter).anchorRecord(
        ethers.ZeroHash,
        digest,
        cid
      )
    ).to.be.revertedWithCustomError(registry, "InvalidInput");
  });

  it("rejects an empty digest", async function () {
    await expect(
      registry.connect(submitter).anchorRecord(
        recordId,
        ethers.ZeroHash,
        cid
      )
    ).to.be.revertedWithCustomError(registry, "InvalidInput");
  });

  it("rejects an empty CID", async function () {
    await expect(
      registry.connect(submitter).anchorRecord(recordId, digest, "")
    ).to.be.revertedWithCustomError(registry, "InvalidInput");
  });

  it("rejects verification of an already verified record", async function () {
    await registry.connect(submitter).anchorRecord(recordId, digest, cid);
    await registry.connect(verifier).verifyRecord(recordId);

    await expect(
      registry.connect(verifier).verifyRecord(recordId)
    ).to.be.revertedWithCustomError(registry, "AlreadyVerified");
  });
});
