# Pixels Invader

##Pages

### Leaderboard
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/leaderboard.tsx)

It takes three different data. 
- Total score from Mongodb using Nextjs Api [Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/fetchall.ts).
- It takes burn record from [smart contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol) using ```getBurnedAmounts()``` function.
- It takes Buy record from [smart contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol) using ```getAllBuyers()``` function.

### IPX
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/ipx.tsx)

This page displays the info about IPX token also it fetches total burned amount and Total Supply of Token using its [smart Contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol) funtion ```getTotalSupply() and getBurnSupply()```
