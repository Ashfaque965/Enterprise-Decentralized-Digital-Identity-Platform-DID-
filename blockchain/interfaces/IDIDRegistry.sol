// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDIDRegistry {
    event DIDCreated(address indexed controller, string did, string documentUri);
    event DIDUpdated(address indexed controller, string did, string documentUri);
    event DIDRevoked(address indexed controller, string did);

    function createDID(string calldata did, string calldata documentUri) external;
    function updateDID(string calldata did, string calldata documentUri) external;
    function revokeDID(string calldata did) external;
    function getDIDDocument(string calldata did) external view returns (string memory);
}