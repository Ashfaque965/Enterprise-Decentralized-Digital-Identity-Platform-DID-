// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AccessControl.sol";

contract Revocation is AccessControl {
    // Maps: Credential Hash => Is Revoked Status
    mapping(bytes32 => bool) private _revokedCredentials;

    event CredentialRevoked(bytes32 indexed credentialHash, address indexed issuer);
    event CredentialUnrevoked(bytes32 indexed credentialHash, address indexed issuer);

    /**
     * @notice Formally revokes a credential commitment hash on-chain.
     */
    function revoke(bytes32 credentialHash) external onlyRole(ISSUER_ROLE) {
        require(!_revokedCredentials[credentialHash], "Revocation: Already flagged as revoked");
        _revokedCredentials[credentialHash] = true;
        emit CredentialRevoked(credentialHash, msg.sender);
    }

    /**
     * @notice Reinstates a revoked credential.
     */
    function unrevoke(bytes32 credentialHash) external onlyRole(ISSUER_ROLE) {
        require(_revokedCredentials[credentialHash], "Revocation: Target is not revoked");
        _revokedCredentials[credentialHash] = false;
        emit CredentialUnrevoked(credentialHash, msg.sender);
    }

    function isRevoked(bytes32 credentialHash) external view returns (bool) {
        return _revokedCredentials[credentialHash];
    }
}