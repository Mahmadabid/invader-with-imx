# Pixels Invader

[Game](https://pixels-invader.vercel.app/)

## Technologies used
- Immutable zkevm
- mongodb
- nextjs
- pinata

## Immutable zkevm
Following Products of immutable zkevm were used

- Immutable Passport
- Metadata Refresh 
- @imtb/sdk
- ERC721Client
- burn
- transfer
- ERC721 contracts

### Metadata Refresh 
Metadata Refresh is dont to update ships and to add more NFTs to the contracts. Metadata files are generated by ```generateFiles.js``` of each contract.

Fire Powerups Contract [generateFiles.js](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/firing/generateFile.js). It fetches the total number of NFTs minted and generate their files and add additional 50 files to accomodate new players.

Health Powerups Contract [generateFiles.js](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/health/generateFile.js). It fetches the total number of NFTs minted and generate their files and add additional 50 files to accomodate new players.

Ships Contract [generateFiles.js](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/ship/generateFile.js). It fetches the total number of NFTs minted and the tokenID and their Level and generates their files by their level to upgrade Ships to Level 2 and add additional 50 files to accomodate new players.

Metadata is Refreshed using ```metadataRefresh.ts``` of each contract, [Ship](https://github.com/Mahmadabid/invader-with-imx/blob/master/ssrc/nftData/ship/metadataRefresh.ts), [Fire](https://github.com/Mahmadabid/invader-with-imx/blob/master/ssrc/nftData/firing/metadataRefresh.ts), [Health](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/health/metadataRefresh.ts)

### Post Mint Refresh
For ship contract NFT are upgraded so NFTs metadata is refreshed using [postMintRefresh.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/ship/postMintRefresh.ts). This upgrades the NFT for next Levels. It fetches the IDs and their Levels form ship smart contract and updates the metadata of upgraded NFTs.

## Smart Contracts
[Code](https://github.com/Mahmadabid/invader-with-imx/tree/master/smartContracts)

### IPX Smart Contract 
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol)

This contract is ERC20 contract for IPX gameToken. It has unique functionality because it doesn't have limited supply. So it is minted when someone buys it and when someone claims it. It is burned when someone sells it or burns it for Acheivements.

### Swap Smart Contract 
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol)

This contract is used to swap IMX and IPX by using mint and burn function of IPX smart contract.

### Ship Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/ShipsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track levels and total Mint amount. It handles Player ship.

### Fire Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/PowerupsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track total Mint amount and mint the Faster Firing NFT by burning IPX.

### Health Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/PowerupsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track total Mint amount and mint the Extra Health NFT by burning IPX.

## Game
[Code](https://github.com/Mahmadabid/invader-with-imx/tree/master/src/components/game)

The game is a space Invaders style game. There is a feature of level. That determines the difficulty and the ship capability. Next Level gives you an upgraded ship. The level and Powerups NFTs are fetched by ```getNftByCollection()``` function from [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts).

You get 1 score for shooting 1 alien. Aliens will move from right to left. Shoot them before they kill you or before time runs out. You will only get IPX if you win. Losers will only get the score. You can add powerups from Market.

### Level
**Level 1** 
- Aliens are less in number. 
- Time is 38sec. 
- Ship can only move left and right 
- It shoots 1 bullet. 
- Aliens firing will be slow.
- On winning 3 IPX is awarded.

**Level 2** 
- Aliens are more in number. 
- Time is 30sec. 
- Ship can only move in all directions. 
- It shoots 2 bullets.
- Aliens Firing is faster
- On winning 5 IPX is awarded.

## Pages

### 1. Game
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/index.tsx)

This page fetches user ship. If ship not found it mints the ship without user paying any gas fee using [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/mintNFT.ts). It fetches the powerups and Level of user and adds powerups and increases the Level of the player using ```getNftByCollection()``` function from [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts). The user can then start the game. After winning the game user receives points and $IPX using [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/data.ts) which the user can claim.

### 2. Inventory
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/inventory.tsx)

This page lists NFTs related to Pixels Invader Collections using blockchainData funtions ```getNftByAddress(address)``` added in [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts) file using ```@imtbl/sdk```.

It then grants option to **burn** and **transfer** and for ship to **upgrade**(Which upgrades the ship level, without user paying any gas fee using [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/upgrade.ts)). All these functions are created using ```@imtbl/sdk```.

### 3. Market
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/market.tsx)

This page allows users to buy Powerups NFTs using $IPX. The market burns $IPX and mints NFTS. The NFT powerups will be provide boost to players to help them win.

### 4. Profile
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/profile.tsx)

This Page fetches user information about IMX, IPX, IPX burned, Unclaimed IPX and Total Points earned in the game using ```getProfileInfo()``` function from [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts).

This Page also allows the user to claim unclaimed IPX using this [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/web3.ts) without user paying any gas fee.

This page also gives acheivemnets badges to players who have burned specific amount of $IPX,are holding speciific amount of $IPX, have acquired specific amount of points by playing the game.

### 5. Swap
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/swap.tsx)

This page allows user to buy and sell $IPX and also to burn them. It uses 2 contracts.
- [IPX contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol)
- [Swap Contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol)

When a user buys token the $IMX is added to liquidity and tokens are minted. When the user sells the tokens are burned and $IMX is sent from liquidity.

The Burn also uses IPX Contract and burns the amount. It is used for Acheivements and Leaderboard.

### 6. Leaderboard
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/leaderboard.tsx)

It takes three different data. 
- Total score from Mongodb using Nextjs Api [Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/fetchall.ts).
- It takes burn record from [smart contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol) using ```getBurnedAmounts()``` function.
- It takes Buy record from [smart contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol) using ```getAllBuyers()``` function.

### 7. IPX
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/ipx.tsx)

This page displays the info about IPX token also it fetches total burned amount and Total Supply of Token using its [smart Contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol) funtion ```getTotalSupply() and getBurnSupply()```

### 8. Root Page 
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/_app.tsx)

This page fetches User Data and and handles login ensuring page remains the same after login.

