// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GameToken.sol";

contract NFTContract is ERC721, Ownable {
    GameToken public gameToken;

    constructor(address _gameToken) ERC721("GameNFT", "GNFT") Ownable(msg.sender) {
        gameToken = GameToken(_gameToken);
    }

    // Burn tokens and mint NFT to user
    function burnAndMint(address to, uint256 tokenAmount) external onlyOwner {
        require(gameToken.balanceOf(msg.sender) >= tokenAmount, "Not enough tokens to burn");
//        gameToken.burnFromUser(msg.sender, tokenAmount);
        _safeMint(to, tokenAmount);
    }
}
