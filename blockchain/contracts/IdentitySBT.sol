// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentitySBT is ERC721, Ownable {
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) public addressToTokenId;

    event ProfileMinted(address indexed holder, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("NexusCore Identity SBT", "NCID") Ownable(msg.sender) {}

    function mintIdentity(address to, string calldata metadataUri) external onlyOwner returns (uint256) {
        require(addressToTokenId[to] == 0, "IdentitySBT: Account already owns an Identity Profile Token");
        
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = metadataUri;
        addressToTokenId[to] = tokenId;

        emit ProfileMinted(to, tokenId, metadataUri);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    // Overriding transfer functions to make the token completely non-transferable (Soulbound)
    function transferFrom(address, address, uint256) public pure override {
        revert("IdentitySBT: Token is Soulbound and non-transferable.");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("IdentitySBT: Token is Soulbound and non-transferable.");
    }
}