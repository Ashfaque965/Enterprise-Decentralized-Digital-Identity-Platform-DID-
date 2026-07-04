// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GovernanceTrustRegistry {
    address public governanceRoot;
    
    struct EntityMetadata {
        bool isApproved;
        string organizationName;
        string metadataUri;
    }

    mapping(address => EntityMetadata) public approvedIssuers;
    mapping(address => EntityMetadata) public approvedVerifiers;

    event IssuerStatusUpdated(address indexed target, bool status);
    event VerifierStatusUpdated(address indexed target, bool status);

    modifier onlyGovernance() {
        require(msg.sender == governanceRoot, "TrustRegistry: Caller is not governance root");
        _;
    }

    constructor(address _gov) {
        governanceRoot = _gov;
    }

    function updateIssuerStatus(address target, bool status, string calldata name, string calldata uri) external onlyGovernance {
        approvedIssuers[target] = EntityMetadata(status, name, uri);
        emit IssuerStatusUpdated(target, status);
    }

    function updateVerifierStatus(address target, bool status, string calldata name, string calldata uri) external onlyGovernance {
        approvedVerifiers[target] = EntityMetadata(status, name, uri);
        emit VerifierStatusUpdated(target, status);
    }
}