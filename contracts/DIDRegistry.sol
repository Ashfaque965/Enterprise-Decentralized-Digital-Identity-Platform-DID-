// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title NexusCore DIDRegistry
 * @notice Manages W3C compliant Decentralized Identifiers (DIDs) and their cryptographic verification methods.
 * @dev Implements granular lifecycle states, key rotation, and metadata tracking.
 */
contract DIDRegistry {
    
    struct VerificationMethod {
        string id;
        string methodType;
        string controller;
        bytes publicKeyMultibase;
    }

    struct DIDDocument {
        string did;
        address owner;
        uint256 version;
        uint256 createdAt;
        uint256 updatedAt;
        bool revoked;
        string documentUri; // IPFS or off-chain immutable URI
    }

    // Maps a DID identifier string (e.g., "did:nexus:12345") to its Document state
    mapping(string => DIDDocument) private _registry;
    
    // Maps a DID identifier string to its collection of verification methods
    mapping(string => VerificationMethod[]) private _verificationMethods;

    // Events for off-chain indexing pipelines (Kafka / The Graph)
    event DIDCreated(string indexed did, address indexed owner, string documentUri);
    event DIDUpdated(string indexed did, address indexed owner, uint256 version, string documentUri);
    event DIDRevoked(string indexed did, address indexed owner);
    event VerificationMethodAdded(string indexed did, string methodId, string methodType);

    modifier onlyController(string memory did) {
        require(_registry[did].owner == msg.sender, "DIDRegistry: Caller is not the authorized DID controller");
        _;
    }

    modifier onlyActive(string memory did) {
        require(_registry[did].createdAt > 0, "DIDRegistry: DID does not exist");
        require(!_registry[did].revoked, "DIDRegistry: DID has been permanently revoked");
        _;
    }

    /**
     * @notice Registers a new Decentralized Identifier within the network.
     */
    function createDID(
        string calldata did,
        string calldata documentUri,
        string[] calldata methodIds,
        string[] calldata methodTypes,
        bytes[] calldata publicKeys
    ) external {
        require(_registry[did].createdAt == 0, "DIDRegistry: DID already registered");
        require(methodIds.length == methodTypes.length && methodTypes.length == publicKeys.length, "DIDRegistry: Mismatched array lengths");

        _registry[did] = DIDDocument({
            did: did,
            owner: msg.sender,
            version: 1,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            revoked: false,
            documentUri: documentUri
        });

        for (uint256 i = 0; i < methodIds.length; i++) {
            _verificationMethods[did].push(VerificationMethod({
                id: methodIds[i],
                methodType: methodTypes[i],
                controller: did,
                publicKeyMultibase: publicKeys[i]
            }));
        }

        emit DIDCreated(did, msg.sender, documentUri);
    }

    /**
     * @notice Updates an existing DID document location and increments its version block.
     */
    function updateDID(string calldata did, string calldata documentUri) 
        external 
        onlyController(did) 
        onlyActive(did) 
    {
        DIDDocument storage doc = _registry[did];
        doc.version += 1;
        doc.updatedAt = block.timestamp;
        doc.documentUri = documentUri;

        emit DIDUpdated(did, msg.sender, doc.version, documentUri);
    }

    /**
     * @notice Permanently revokes a DID, locking its configuration status.
     */
    function revokeDID(string calldata did) 
        external 
        onlyController(did) 
        onlyActive(did) 
    {
        _registry[did].revoked = true;
        _registry[did].updatedAt = block.timestamp;

        emit DIDRevoked(did, msg.sender);
    }

    /**
     * @notice Resolves and retrieves active data state for a specified DID.
     */
    function resolveDID(string calldata did) 
        external 
        view 
        returns (DIDDocument memory doc, VerificationMethod[] memory methods) 
    {
        require(_registry[did].createdAt > 0, "DIDRegistry: Target DID cannot be found");
        return (_registry[did], _verificationMethods[did]);
    }
}