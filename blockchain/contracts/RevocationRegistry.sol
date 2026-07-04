// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RevocationRegistry is Ownable {
    // Maps Issuer Address => (Credential Hash => Revocation Status)
    mapping(address => mapping(bytes32 => bool)) private _revocationStates;

    event CredentialRevoked(address indexed issuer, bytes32 indexed credentialHash, uint256 timestamp);
    event CredentialUnrevoked(address indexed issuer, bytes32 indexed credentialHash, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Revokes a specific Verifiable Credential.
     */
    function revokeCredential(bytes32 credentialHash) external {
        _revocationStates[msg.sender][credentialHash] = true;
        emit CredentialRevoked(msg.sender, credentialHash, block.timestamp);
    }

    /**
     * @notice Reverts a previous revocation if an identity is reinstated.
     */
    function unrevokeCredential(bytes32 credentialHash) external {
        _revocationStates[msg.sender][credentialHash] = false;
        emit CredentialUnrevoked(msg.sender, credentialHash, block.timestamp);
    }

    /**
     * @notice External view optimization for high-throughput verifier engines.
     */
    function isRevoked(address issuer, bytes32 credentialHash) external view returns (bool) {
        return _revocationStates[issuer][credentialHash];
    }
}