// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DIDRegistry {
    struct DIDRecord {
        address owner;
        string documentUri; // IPFS URI to the W3C DID Document
        uint256 updated;
        bool active;
    }

    mapping(string => DIDRecord) private registry;

    event DIDCreated(string indexed did, address indexed owner, string documentUri);
    event DIDUpdated(string indexed did, address indexed owner, string documentUri);

    modifier onlyByOwner(string memory did) {
        require(registry[did].active, "DID is inactive");
        require(registry[did].owner == msg.sender, "Caller is not the identity owner");
        _;
    }

    function createDID(string calldata did, string calldata documentUri) external {
        require(registry[did].owner == address(0), "DID already registered");
        registry[did] = DIDRecord(msg.sender, documentUri, block.timestamp, true);
        emit DIDCreated(did, msg.sender, documentUri);
    }

    function updateDID(string calldata did, string calldata newUri) external onlyByOwner(did) {
        registry[did].documentUri = newUri;
        registry[did].updated = block.timestamp;
        emit DIDUpdated(did, msg.sender, newUri);
    }

    function resolveDID(string calldata did) external view returns (address owner, string memory documentUri, bool active) {
        DIDRecord memory record = registry[did];
        require(record.owner != address(0), "DID does not exist");
        return (record.owner, record.documentUri, record.active);
    }
}