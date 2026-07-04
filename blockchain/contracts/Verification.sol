// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AccessControl.sol";
import "./CredentialRegistry.sol";
import "./Revocation.sol";

contract Verification is AccessControl {
    CredentialRegistry public immutable credentialRegistry;
    Revocation public immutable revocationRegistry;

    event VerificationPerformed(bytes32 indexed credentialHash, address indexed verifier, bool valid);

    constructor(address credentialRegistryAddress, address revocationRegistryAddress) {
        credentialRegistry = CredentialRegistry(credentialRegistryAddress);
        revocationRegistry = Revocation(revocationRegistryAddress);
    }

    /**
     * @notice Performs a cryptographic runtime evaluation of a credential asset.
     * @dev Checks validation ranges, signature anchor existences, and structural revocations simultaneously.
     */
    function verifyCredential(bytes32 credentialHash) external onlyRole(VERIFIER_ROLE) returns (bool) {
        // 1. Query the base registry parameters
        (
            address issuer,
            ,
            uint256 validFrom,
            uint256 validTo,
            bool active
        ) = credentialRegistry.getCredential(credentialHash);

        // 2. Compute verification criteria matrix
        bool baseExists = active && issuer != address(0);
        bool insideTimeBounds = block.timestamp >= validFrom && block.timestamp <= validTo;
        bool notRevoked = !revocationRegistry.isRevoked(credentialHash);

        bool evaluationResult = baseExists && insideTimeBounds && notRevoked;

        emit VerificationPerformed(credentialHash, msg.sender, evaluationResult);
        return evaluationResult;
    }
}