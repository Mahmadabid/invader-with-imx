// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GameToken.sol"; // Import statement for GameToken contract

contract SwapContract is Ownable {
    GameToken public gameToken; // Reference to the GameToken contract

    uint256 public conversionRate = 100; // Conversion rate: 1 tIMX = 100 tokens
    uint256 public feePercentage = 0; // Fee percentage: 1%
    uint256 public accumulatedLiquidity; // Accumulated tIMX for liquidity

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

    // Function to change the conversion rate, only callable by the owner
    function setConversionRate(uint256 _newRate) external onlyOwner {
        conversionRate = _newRate;
    }

    // Function to convert tokens to tIMX
    function convertToTIMX(uint256 _tokens) external {
        require(_tokens > 0, "Invalid token amount");

        // Calculate the tIMX to be received and the fee
        uint256 tIMXToReceive = (_tokens *
            conversionRate *
            (100 - feePercentage)) / 100;
        uint256 feeAmount = (_tokens * feePercentage) / 100;

        // Mint tokens to the user from the GameToken contract
        gameToken.mintBySwapContract(msg.sender, _tokens);

        // Emit an event
        emit TokensConverted(msg.sender, _tokens, tIMXToReceive);

    }

    // Function to convert tIMX to tokens, deduct fee, and mint tokens to the user
    function convertToTokensAndMint(uint256 _tIMX) external {
        require(_tIMX > 0, "Invalid tIMX amount");

        // Calculate the tokens to be minted, the fee, and the net amount
        uint256 tokensToMint = (_tIMX * conversionRate);
        uint256 feeAmount = (tokensToMint * feePercentage) / 100;
        uint256 netTokensToMint = tokensToMint - feeAmount;

        // Emit an event
        emit TIMXConverted(msg.sender, _tIMX, netTokensToMint);

        // Mint net tokens (after deducting the fee) to the user from the GameToken contract
        gameToken.mintBySwapContract(msg.sender, netTokensToMint);
    }

    // Function to add tIMX for liquidity (anyone can add)
    function addTIMX(uint256 _amount) external {
        require(_amount > 0, "Invalid tIMX amount");

        // Accumulate tIMX for liquidity
        accumulatedLiquidity += _amount;
    }

    // Function to view the accumulated liquidity
    function viewAccumulatedLiquidity() external view returns (uint256) {
        return accumulatedLiquidity;
    }
}
