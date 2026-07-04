// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CredentialIssuer {
    mapping(address => bool) public authorizedIssuers;

    event IssuerProvisioned(address indexed entity);
    event ClaimIssuedLog(bytes32 indexed claimHash, address indexed targetSubject);

    constructor() {
        authorizedIssuers[msg.sender] = true;
    }

    function issueAssertLog(bytes32 claimHash, address subject) external {
        require(authorizedIssuers[msg.sender], "CredentialIssuer: calling provider lacks delegation rights");
        emit ClaimIssuedLog(claimHash, subject);
    }
}