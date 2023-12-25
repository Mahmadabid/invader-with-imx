# Pixels Invader

## Pages

### Swap
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/swap.tsx)

This page allows user to buy and sell $IPX and also to burn them. It uses 2 contracts.
- [IPX contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol)
- [Swap Contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol)

When a user buys token the $IMX is added to liquidity and tokens are minted. When the user sells the tokens are burned and $IMX is sent from liquidity.

The Burn also uses IPX Contract and burns the amount. It is used for Acheivements and Leaderboard.

### Inventory
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/inventory.tsx)

This page lists NFTs related to Pixels Invader Collections using blockchainData funtions ```getNftByAddress(address)``` added in [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts) file using ```@imtbl/sdk```.

It then grants option to **burn** and **transfer** and for ship to **upgrade**(Coming soon). All these functions are created using ```@imtbl/sdk```.

### Leaderboard
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/leaderboard.tsx)

It takes three different data. 
- Total score from Mongodb using Nextjs Api [Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/fetchall.ts).
- It takes burn record from [smart contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol) using ```getBurnedAmounts()``` function.
- It takes Buy record from [smart contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol) using ```getAllBuyers()``` function.

### IPX
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/ipx.tsx)

This page displays the info about IPX token also it fetches total burned amount and Total Supply of Token using its [smart Contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol) funtion ```getTotalSupply() and getBurnSupply()```

### Root Page 
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/_app.tsx)

This page fetches User Data and and handles login ensuring page remains the same after login.

