// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GameToken.sol";

contract SwapContract is Ownable {
    GameToken public gameToken;

    uint256 public conversionRate = 100;
    uint256 public feePercentage = 1;
    uint256 public accumulatedLiquidity;

    uint8 public constant tokenDecimals = 18; // Assuming 18 decimals for tokens
    uint8 public constant tIMXDecimals = 18;  // Assuming 18 decimals for tIMX

    event TokensConverted(
        address indexed user,
        uint256 tokensSent,
        uint256 tIMXReceived
    );
    event TIMXConverted(
        address indexed user,
        uint256 tIMXSent,
        uint256 tokensReceived
    );

    constructor(address _gameTokenAddress) Ownable(msg.sender) {
        gameToken = GameToken(_gameTokenAddress);
    }

    function setConversionRate(uint256 _newRate) external onlyOwner {
        conversionRate = _newRate;
    }

    function convertToTIMX(uint256 _tokens) external {
        require(_tokens > 0, "Invalid token amount");

        uint256 tIMXToReceive = (_tokens * conversionRate * (10**tIMXDecimals) * (100 - feePercentage)) / 100;
        uint256 feeAmount = (_tokens * feePercentage) / 100;

        gameToken.mintBySwapContract(msg.sender, _tokens);

        emit TokensConverted(msg.sender, _tokens, tIMXToReceive);
    }

    function convertToTokensAndMint(uint256 _tIMX) external {
        require(_tIMX > 0, "Invalid tIMX amount");

        uint256 tokensToMint = (_tIMX * (10**tokenDecimals) * conversionRate) / (10**tIMXDecimals);
        uint256 feeAmount = (tokensToMint * feePercentage) / 100;
        uint256 netTokensToMint = tokensToMint - feeAmount;

        emit TIMXConverted(msg.sender, _tIMX, netTokensToMint);

        gameToken.mintBySwapContract(msg.sender, netTokensToMint);
    }

    function addTIMX(uint256 _amount) external {
        require(_amount > 0, "Invalid tIMX amount");
        accumulatedLiquidity += _amount;
    }

    function viewAccumulatedLiquidity() external view returns (uint256) {
        return accumulatedLiquidity;
    }
}
