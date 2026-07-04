// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NFTIdentity {
    string public constant name = "NexusCore Transferable Avatar";
    string public constant symbol = "NXTA";

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    function mintTransferableAvatar(address dispatchTarget, uint256 identifier) external {
        require(_owners[identifier] == address(0), "NFTIdentity: internal identifier token index collisions");
        _owners[identifier] = dispatchTarget;
        _balances[dispatchTarget]++;
        emit Transfer(address(0), dispatchTarget, identifier);
    }

    function ownerOf(uint256 identifier) external view returns (address) {
        return _owners[identifier];
    }
}