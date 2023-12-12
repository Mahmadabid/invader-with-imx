// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GameToken.sol";

contract Swap {
    GameToken public gameToken;

    uint256 public tokensPertIMX = 100;
    uint256 public feePercentage = 1;

    mapping(address => uint256) public totalAmountBought;
    address[] public buyersList;

    event BuyTokens(
        address buyer,
        uint256 amountOftIMX,
        uint256 amountOfTokens
    );
    event SellTokens(
        address seller,
        uint256 amountOfTokens,
        uint256 amountOftIMX
    );
    event TokensPertIMXChanged(uint256 newTokensPertIMX);
    event FeePercentageChanged(uint256 newFeePercentage);
    event TotalAmountBought(address buyer, uint256 totalAmountBought);
    event DebugLog(string message);

    constructor(address tokenAddress) {
        gameToken = GameToken(tokenAddress);
    }

    receive() external payable {
        uint256 amountToBuy = msg.value * tokensPertIMX;
        uint256 fee = (amountToBuy * feePercentage) / 100;
        uint256 totalAmount = amountToBuy - fee;

        gameToken.mintBySwapContract(msg.sender, totalAmount);
        totalAmountBought[msg.sender] += totalAmount;

        if (totalAmountBought[msg.sender] == totalAmount) {
            buyersList.push(msg.sender);
        }

        emit BuyTokens(msg.sender, msg.value, amountToBuy);
        emit TotalAmountBought(msg.sender, totalAmountBought[msg.sender]);
    }

    function getAllBuyers() public view returns (BuyerInfo[] memory) {
        BuyerInfo[] memory buyersInfo = new BuyerInfo[](buyersList.length);

        for (uint256 i = 0; i < buyersList.length; i++) {
            address buyer = buyersList[i];
            buyersInfo[i] = BuyerInfo({
                buyerAddress: buyer,
                totalAmountBought: totalAmountBought[buyer]
            });
        }

        return buyersInfo;
    }

    struct BuyerInfo {
        address buyerAddress;
        uint256 totalAmountBought;
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

        uint256 fee = (tokenAmountToSell * feePercentage) / 100;
        uint256 amountOftIMXToTransfer = (tokenAmountToSell - fee) / tokensPertIMX;

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

    function setFeePercentage(uint256 newFeePercentage) public {
        require(msg.sender == owner(), "Only owner can change feePercentage");
        feePercentage = newFeePercentage;
        emit FeePercentageChanged(newFeePercentage);
    }

    function owner() internal view returns (address) {
        return gameToken.owner();
    }

    function gettIMXBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
