// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GameToken.sol";

contract BurnContract {
    GameToken public gameToken;

    struct BurnRecord {
        address sender;
        uint256 tokenAmount;
    }

    BurnRecord[] public burnRecords;

    constructor(GameToken _gameToken) {
        gameToken = _gameToken;
    }

    fallback() external {
        uint256 tokensToBurn = gameToken.balanceOf(address(this));
        require(tokensToBurn > 0, "No tokens to burn");
        gameToken.burn(tokensToBurn);

        burnRecords.push(
            BurnRecord({
                sender: msg.sender,
                tokenAmount: tokensToBurn
            })
        );
    }

    function getBurnRecordsByAddress(
        address _address
    ) external view returns (uint256 totalTokensBurnt) {
        uint256 tokensBurntByAddress = 0;
        for (uint256 i = 0; i < burnRecords.length; i++) {
            if (burnRecords[i].sender == _address) {
                tokensBurntByAddress += burnRecords[i].tokenAmount;
            }
        }
        return tokensBurntByAddress;
    }
}
