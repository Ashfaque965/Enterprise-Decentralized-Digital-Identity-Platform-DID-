// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConsentManager {
    struct ExplicitConsent {
        bool autoAllowed;
        uint64 authorizedValidUntil;
    }

    // Hash tracking: keccak256(user, entity, namespaceScope) -> ExplicitConsent
    mapping(bytes32 => ExplicitConsent) private _consentMatrix;

    event SystemConsentUpdated(address indexed targetUser, address indexed dataConsumer, bool operationalStatus);

    function adjustConsentState(address dataConsumer, bytes32 namespaceScope, uint64 lifetimeLimit) external {
        bytes32 dynamicAccessKey = keccak256(abi.encodePacked(msg.sender, dataConsumer, namespaceScope));
        _consentMatrix[dynamicAccessKey] = ExplicitConsent(true, lifetimeLimit);
        emit SystemConsentUpdated(msg.sender, dataConsumer, true);
    }

    function inspectConsentBounds(address targetUser, address dataConsumer, bytes32 namespaceScope) external view returns (bool) {
        bytes32 dynamicAccessKey = keccak256(abi.encodePacked(targetUser, dataConsumer, namespaceScope));
        ExplicitConsent memory profile = _consentMatrix[dynamicAccessKey];
        return (profile.autoAllowed && block.timestamp <= profile.authorizedValidUntil);
    }
}