// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GameToken.sol";

contract SwapContract is Ownable {
    GameToken public gameToken;
    
    uint256 public conversionRate = 100;
    uint256 public feePercentage = 0;
    uint256 public accumulatedLiquidity;

    event TokensConverted(
        address indexed user,
        uint256 tokensSent,
        uint256 etherReceived
    );
    
    event EtherConverted(
        address indexed user,
        uint256 etherSent,
        uint256 tokensReceived
    );

    constructor(address _gameTokenAddress) Ownable(msg.sender) {
        gameToken = GameToken(_gameTokenAddress);
    }

    function setConversionRate(uint256 _newRate) external onlyOwner {
        conversionRate = _newRate;
    }

    function convertToEther(uint256 _tokens) external {
    require(_tokens > 0, "Invalid token amount");

    uint256 feeAmount = (_tokens * feePercentage) / 100;
    uint256 etherToReceive = ((_tokens - feeAmount) * conversionRate * (100 - feePercentage)) / 100;

    gameToken.burn(_tokens);
    
    (bool success, ) = payable(msg.sender).call{value: etherToReceive}("");
    require(success, "Transfer failed");

    emit TokensConverted(msg.sender, _tokens, etherToReceive);
}


    function convertToTokensAndMint() external payable {
        require(msg.value > 0, "Invalid Ether amount");

        uint256 tokensToMint = (msg.value * conversionRate);
        uint256 feeAmount = (tokensToMint * feePercentage) / 100;
        uint256 netTokensToMint = tokensToMint - feeAmount;

        accumulatedLiquidity += msg.value;

        emit EtherConverted(msg.sender, msg.value, netTokensToMint);

        gameToken.mintBySwapContract(msg.sender, netTokensToMint);
    }

    function addEtherToLiquidity() external payable {
        require(msg.value > 0, "Invalid Ether amount");

        accumulatedLiquidity += msg.value;
    }

    function viewAccumulatedLiquidity() external view returns (uint256) {
        return accumulatedLiquidity;
    }
}
