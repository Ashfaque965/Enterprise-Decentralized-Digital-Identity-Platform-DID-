// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CryptographyUtils
 * @notice Provides basic architectural helpers for hashing operations within identity layers.
 */
library CryptographyUtils {
    function generateIdentityDigest(address target, string memory dynamicScopeSalt) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(target, dynamicScopeSalt));
    }
}