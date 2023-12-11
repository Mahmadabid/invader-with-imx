// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GameToken.sol";

contract Swap {
    GameToken public gameToken;

    uint256 public tokensPertIMX = 100;

    event BuyTokens(address buyer, uint256 amountOftIMX, uint256 amountOfTokens);
    event SellTokens(
        address seller,
        uint256 amountOfTokens,
        uint256 amountOftIMX
    );
    event TokensPertIMXChanged(uint256 newTokensPertIMX);

    constructor(address tokenAddress) {
        gameToken = GameToken(tokenAddress);
    }

    receive() external payable {

        uint256 amountToBuy = msg.value * tokensPertIMX;
        gameToken.mintBySwapContract(msg.sender, amountToBuy);
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
    }

    function sellTokens(uint256 tokenAmountToSell) public {
        require(
            tokenAmountToSell > 0,
            "Specify an amount of token greater than zero"
        );

        uint256 userBalance = gameToken.balanceOf(msg.sender);
        require(
            userBalance >= tokenAmountToSell,
            "Your balance is lower than the amount of tokens you want to sell"
        );

        uint256 amountOftIMXToTransfer = tokenAmountToSell / tokensPertIMX;
        uint256 ownertIMXBalance = address(this).balance;
        require(
            ownertIMXBalance >= amountOftIMXToTransfer,
            "Vendor has not enough funds to accept the sell request"
        );

        gameToken.burnFrom(msg.sender, tokenAmountToSell);

        (bool sent, ) = msg.sender.call{value: amountOftIMXToTransfer}("");
        require(sent, "Failed to send tIMX to the user");
    }

    function setTokensPertIMX(uint256 newTokensPertIMX) public {
        require(msg.sender == owner(), "Only owner can change tokensPertIMX");
        tokensPertIMX = newTokensPertIMX;
        emit TokensPertIMXChanged(newTokensPertIMX);
    }

    function owner() internal view returns (address) {
        return gameToken.owner();
    }

    function getTotalTokens() public view returns (uint256) {
        return gameToken.balanceOf(address(this));
    }

    function gettIMXBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
