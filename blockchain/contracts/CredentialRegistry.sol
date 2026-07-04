// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AccessControl.sol";

contract CredentialRegistry is AccessControl {
    struct CredentialAnchor {
        address issuer;
        bytes32 subjectDidHash;
        uint256 validFrom;
        uint256 validTo;
        bool active;
    }

    // Maps: Credential Hash => Struct configuration
    mapping(bytes32 => CredentialAnchor) private _anchors;

    event CredentialAnchored(bytes32 indexed credentialHash, address indexed issuer, bytes32 indexed subjectDidHash);

    /**
     * @notice Registers a new credential anchor on the blockchain.
     */
    function anchorCredential(
        bytes32 credentialHash,
        bytes32 subjectDidHash,
        uint256 validFrom,
        uint256 validTo
    ) external onlyRole(ISSUER_ROLE) {
        require(!_anchors[credentialHash].active, "CredentialRegistry: Already anchored");
        require(validTo > validFrom, "CredentialRegistry: Invalid expiration bounds");

        _anchors[credentialHash] = CredentialAnchor({
            issuer: msg.sender,
            subjectDidHash: subjectDidHash,
            validFrom: validFrom,
            validTo: validTo,
            active: true
        });

        emit CredentialAnchored(credentialHash, msg.sender, subjectDidHash);
    }

    function getCredential(bytes32 credentialHash) external view returns (
        address issuer,
        bytes32 subjectDidHash,
        uint256 validFrom,
        uint256 validTo,
        bool active
    ) {
        CredentialAnchor memory anchor = _anchors[credentialHash];
        require(anchor.active, "CredentialRegistry: Record non-existent");
        return (anchor.issuer, anchor.subjectDidHash, anchor.validFrom, anchor.validTo, anchor.active);
    }
}