
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract TicketRecordRegistry is AccessControl {
    bytes32 public constant SUBMITTER_ROLE = keccak256("SUBMITTER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Record {
        bytes32 digest;
        string cid;
        address submitter;
        uint256 anchoredAt;
        bool exists;
        bool verified;
    }

    mapping(bytes32 => Record) public records;

    event RecordAnchored(
        bytes32 indexed recordId,
        bytes32 digest,
        string cid,
        address indexed submitter
    );

    event RecordVerified(
        bytes32 indexed recordId,
        address indexed verifier
    );

    error NotAuthorized();
    error SelfVerification();
    error RecordNotFound();
    error DuplicateRecord();
    error InvalidInput();
    error AlreadyVerified();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function anchorRecord(
        bytes32 recordId,
        bytes32 digest,
        string calldata cid
    ) external {
        if (!hasRole(SUBMITTER_ROLE, msg.sender)) {
            revert NotAuthorized();
        }

        if (
            recordId == bytes32(0) ||
            digest == bytes32(0) ||
            bytes(cid).length == 0
        ) {
            revert InvalidInput();
        }

        if (records[recordId].exists) {
            revert DuplicateRecord();
        }

        records[recordId] = Record({
            digest: digest,
            cid: cid,
            submitter: msg.sender,
            anchoredAt: block.timestamp,
            exists: true,
            verified: false
        });

        emit RecordAnchored(recordId, digest, cid, msg.sender);
    }

    function verifyRecord(bytes32 recordId) external {
        if (!hasRole(VERIFIER_ROLE, msg.sender)) {
            revert NotAuthorized();
        }

        Record storage record = records[recordId];

        if (!record.exists) {
            revert RecordNotFound();
        }

        if (record.submitter == msg.sender) {
            revert SelfVerification();
        }

        if (record.verified) {
            revert AlreadyVerified();
        }

        record.verified = true;

        emit RecordVerified(recordId, msg.sender);
    }
}
