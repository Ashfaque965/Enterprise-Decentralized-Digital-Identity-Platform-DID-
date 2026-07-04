// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IdentityRegistry {
    struct SystemIdentity {
        address identityAddress;
        string multiTenantCode;
        uint256 registrationBlock;
        bool authorizedActive;
    }

    mapping(address => SystemIdentity) private _identities;

    event IdentityRegistered(address indexed account, string countryCode);
    event IdentityStatusAltered(address indexed account, bool currentStatus);

    function registerCoreIdentity(address target, string calldata countryIso) external {
        _identities[target] = SystemIdentity(target, countryIso, block.number, true);
        emit IdentityRegistered(target, countryIso);
    }

    function getIdentityMetadata(address target) external view returns (string memory, uint256, bool) {
        SystemIdentity memory identity = _identities[target];
        return (identity.multiTenantCode, identity.registrationBlock, identity.authorizedActive);
    }
}