// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Nft is ERC721 {
    uint256 id;
    constructor() ERC721("Nft", "NFT") {}

    function mint(address to) public returns (uint256) {
        id += 1;
        _mint(to, id);
        return id;
    }
}