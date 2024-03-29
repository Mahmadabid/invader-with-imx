# Pixels Invader

### Play the Game
[Game App](https://pixels-invader.vercel.app/)

<br>

![image](https://github.com/Mahmadabid/invader-with-imx/assets/75790323/ebc638a6-538a-4109-8ed6-adbcb39f2aff)

### GamePlay
https://github.com/Mahmadabid/invader-with-imx/assets/75790323/add1ccd9-5f1b-49d5-8776-ec39d1f1278a

## Technologies used
- Immutable zkevm
- mongodb
- nextjs
- pinata
- open

## Immutable zkevm
Following Products of immutable zkevm were used

- Immutable Passport
- Metadata Refresh
- Checkout
- Widgets
- @imtb/sdk
- ERC721Client
- ERC721 contracts
- JWTs
- burn
- transfer
- mint


## Metadata Refresh 
Metadata Refresh is done to update ships and to add more NFTs to the contracts.

Metadata Refresh is being done in two ways.

#### Automatic Metadata Refresh
When the ship is upgraded using [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/upgrade.ts) through inventory page. The NFT metadata is also updated using immutable ```refreshNFTMetadata()``` function.

#### Manual Metadata Refresh 
Metadata Refresh is also done manually. Metadata files are generated by ```generateFiles.ts``` of each contract.

Move to root folder. Do this for all commands in [nftData Folder](https://github.com/Mahmadabid/invader-with-imx/tree/master/src/nftData). In [tsconfig.json](https://github.com/Mahmadabid/invader-with-imx/blob/master/tsconfig.json) make sure to replace ```"module": "esnext",``` with ```"module": "commonjs",```
```
./node_modules/.bin/ts-node src/nftData/FolderName/generateFile.ts
```
Replace FolderName with the name of folder:
```
./node_modules/.bin/ts-node src/nftData/ship/generateFile.ts
./node_modules/.bin/ts-node src/nftData/timer/generateFile.ts
./node_modules/.bin/ts-node src/nftData/health/generateFile.ts
./node_modules/.bin/ts-node src/nftData/teleport/generateFile.ts
./node_modules/.bin/ts-node src/nftData/firing/generateFile.ts
./node_modules/.bin/ts-node src/nftData/enemyFiring/generateFile.ts
```

Fire Powerups Contract [generateFiles.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/firing/generateFile.ts). It fetches the total number of NFTs minted and generate their files and add additional 50 files to accomodate new players.

Health Powerups Contract [generateFiles.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/health/generateFile.ts). It fetches the total number of NFTs minted and generate their files and add additional 50 files to accomodate new players.

Teleport Powerups Contract [generateFiles.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/teleport/generateFile.ts). It fetches the total number of NFTs minted and generate their files and add additional 50 files to accomodate new players.

Timer Powerups Contract [generateFiles.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/timer/generateFile.ts). It fetches the total number of NFTs minted and generate their files and add additional 50 files to accomodate new players.

Enemy Fire Powerups Contract [generateFiles.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/enemyFiring/generateFile.ts). It fetches the total number of NFTs minted and generate their files and add additional 50 files to accomodate new players.

Ships Contract [generateFiles.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/ship/generateFile.ts). It fetches the total number of NFTs minted and the tokenID and their Level and generates their files by their level to upgrade Ships to Level 2, 3 and 4 and add additional 50 files to accomodate new players.

Metadata is Refreshed using ```metadataRefresh.ts``` of each contract, [Ship](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/ship/metadataRefresh.ts), [Fire](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/firing/metadataRefresh.ts), [Enemy Fire](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/enemyFiring/metadataRefresh.ts), [Health](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/health/metadataRefresh.ts), [Timer](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/timer/metadataRefresh.ts), [Teleport](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/teleport/metadataRefresh.ts)

Use this command
```
./node_modules/.bin/ts-node src/nftData/FolderName/metadataRefresh.ts
```

#### Post Mint Refresh
For ship contract NFT are upgraded so NFTs metadata is refreshed using [postMintRefresh.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/nftData/ship/postMintRefresh.ts). This upgrades the NFT for next Levels. It fetches the IDs and their Levels form ship smart contract and updates the metadata of upgraded NFTs.

Use this command
```
./node_modules/.bin/ts-node ship/metadataRefresh.ts
```


## Checkout
Checkout is used to bridge Ether from Ethereum to Immutable Zkevm. Currently it bridges sepolia to immutable zkevm testnet. You can bridge IMX directly to immutable Passport wallet. It also enables the option to swap tokens supported by checkout.

You can view the checkout features at [Bridge Page](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/bridge.tsx)


## Widgets
Three widgets are being used. 
* Connect
* Swap
* Bridge

#### Connect
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/components/Login.tsx)

The connect widget is used to connect immutable Passport and Metamask to the Pixels Invader. It serves as a login.

#### Swap
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/bridge.tsx)

The swap widget allows you to swap IMX with other tokens supported by checkout.

#### Bridge
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/bridge.tsx)

The bridge widget allows you to bridge Ether between Ethereum and Immutable Zkevm.


## Smart Contracts
[Code](https://github.com/Mahmadabid/invader-with-imx/tree/master/smartContracts)

#### IPX Smart Contract 
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol)

This contract is ERC20 contract for IPX gameToken. It has unique functionality because it doesn't have limited supply. So it is minted when someone buys it and when someone claims it. It is burned when someone sells it or burns it for Acheivements.

#### Swap Smart Contract 
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol)

This contract is used to swap IMX and IPX by using mint and burn function of IPX smart contract.

#### Ship Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/ShipsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track levels and total Mint amount. It handles Player ship.

#### Fire Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/PowerupsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track total Mint amount and mint the Faster Firing NFT by burning IPX.

#### Enemy Fire Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/PowerupsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track total Mint amount and mint the Slower Enemy Firing NFT by burning IPX.

#### Health Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/PowerupsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track total Mint amount and mint the Extra Health NFT by burning IPX.

#### Teleport Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/PowerupsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track total Mint amount and mint the Teleport NFT by burning IPX.

#### Timer Smart Contract
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/PowerupsMint.sol)

This contract is Immutable prebuilt ERC721 contract. It was modified to track total Mint amount and mint the Extra Time NFT by burning IPX.


## JWTs
JWTs are fetched using [Immutable JWT Guide](https://docs.immutable.com/docs/zkEVM/products/passport/identity/jwt). They are used to authenticate api to prevent unauthorized access. They are used through [key.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/components/key.ts) and with their verification is being done in [api](https://github.com/Mahmadabid/invader-with-imx/tree/master/src/pages/api). For immutable passport JWT are used. For metamask env is used for verification.


## API
[Code](https://github.com/Mahmadabid/invader-with-imx/tree/master/src/pages/api)


#### Data API
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/data.ts)

It fetches data based on userID and also is used to modify data of each user after every game and when user claims unclaimed IPX.


#### FetchAll API
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/fetchall.ts)

It fetches data of all users. It is used to make leaderboard.


#### MintNft API
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/mintNft.ts)

It mints Ship for new player using immutable sdk mint function. It also sets their level to 1.


#### Upgrade API
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/upgrade.ts)

It upgrades Ship to Level 2, 3 and 4. It also uses metadata refresh from immutable and refreshes the data of NFT.


#### Web3 API
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/web3.ts)

It mints IPX. It is used to claim unclaimed IPX.


## Game
[Code](https://github.com/Mahmadabid/invader-with-imx/tree/master/src/components/game)

The game is a space Invaders style game. There is a feature of level. That determines the difficulty and the ship capability. Next Level gives you an upgraded ship. The Ship and Powerups NFTs are fetched by ```getNftByCollection()``` function from [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts).

You get 0.5 score for shooting 1 alien. Aliens will move from right to left. Shoot them before they kill you or before time runs out. You will only get IPX if you win. Losers will only get the score. You can add powerups from Market.

#### Level
Level upgrades your ship. Level also determines difficulty level.

**Level 1** 
- Aliens are less in number. 
- Time is 32ec. 
- Ship can only move left and right 
- It shoots 1 bullet. 
- Aliens firing will be slow.
- On winning 1 IPX is awarded.

**Level 2** 
- Aliens are more in number. 
- Time is 24sec. 
- Ship can move in all directions. 
- It shoots 2 bullets.
- Aliens Firing is faster
- On winning 2 IPX is awarded.

**Level 3** 
- Aliens are more in number. 
- Time is 20sec. 
- Ship can move in all directions. 
- It shoots 3 bullets.
- Aliens Firing is faster
- On winning 2.5 IPX is awarded.
- Debris starts coming.

**Level 4** 
- Aliens are same in number as Level 3. 
- Time is 20sec. 
- Ship can move in all directions. 
- It shoots 3 bullets.
- Aliens Firing is faster
- On winning 3 IPX is awarded.
- Debris appears more frequently.
- Ship fires faster.
- Ship moves faster.
- Ship can move through right border to left border and vice versa (no horizontal barrier for ship).

#### Powerups
There are five powerups in this game. Extra Health, Extra Time, Teleport, Slower Enemy Firing and Faster Firing. These can be bought in market. 
- Extra Health gives 1 extra health.
- Extra Time gives 5 extra seconds.
- Faster Firing speed up Players Firing by 100 milliseconds or 0.1 seconds
- Slower Enemy Firing slows down Enemy Firing.
- Teleport allows you to teleport at Starting Position.


## Pages

#### 1. Game
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/index.tsx)

This page fetches user ship. If ship not found it mints the ship without user paying any gas fee using [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/mintNFT.ts). It fetches the powerups and Level of user and adds powerups and increases the Level of the player using ```getNftByCollection()``` function from [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts). The user can then start the game. After winning the game user receives points and $IPX using [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/data.ts) which the user can claim.

#### 2. Inventory
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/inventory.tsx)

This page lists NFTs related to Pixels Invader Collections using blockchainData funtions ```getNftByAddress(address)``` added in [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts) file using ```@imtbl/sdk```.

It then grants option to **burn** and **transfer** and for ship to **upgrade**(Which upgrades the ship level, without user paying any gas fee using [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/upgrade.ts)). All these functions are created using ```@imtbl/sdk```.

#### 3. Market
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/market.tsx)

This page allows users to buy Powerups NFTs using $IPX. The market burns $IPX and mints NFTS. The NFT powerups will be provide boost to players to help them win.

#### 4. Swap
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/swap.tsx)

This page allows user to buy and sell $IPX and also to burn them. It uses 2 contracts.
- [IPX contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol)
- [Swap Contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol)

When a user buys token the $IMX is added to liquidity and tokens are minted. When the user sells the tokens are burned and $IMX is sent from liquidity.

The Burn also uses IPX Contract and burns the amount. It is used for Acheivements and Leaderboard.

#### 5. Bridge
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/bridge.tsx)

This page uses immutable checkput functionality to bridge and swap tokens. The bridge is from sepolia and immutable zkevm testnet. You can bridge directly to immutable passport wallet. The swap allows to swap tokens supported by immutable checkout.

#### 6. Profile
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/profile.tsx)

This Page fetches user information about IMX, IPX, IPX burned, Unclaimed IPX and Total Points earned in the game using ```getProfileInfo()``` function from [immutable.ts](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/utils/immutable.ts).

This Page also allows the user to claim unclaimed IPX using this [api](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/web3.ts) without user paying any gas fee.

This page also gives acheivemnets badges to players who have burned specific amount of $IPX,are holding speciific amount of $IPX, have acquired specific amount of points by playing the game.


#### 7. Leaderboard
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/leaderboard.tsx)

It takes three different data. 
- Total score from Mongodb using Nextjs Api [Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/api/fetchall.ts).
- It takes burn record from [smart contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol) using ```getBurnedAmounts()``` function.
- It takes Buy record from [smart contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/Swap.sol) using ```getAllBuyers()``` function.

#### 8. IPX
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/ipx.tsx)

This page displays the info about IPX token also it fetches total burned amount and Total Supply of Token using its [smart Contract](https://github.com/Mahmadabid/invader-with-imx/blob/master/smartContracts/contracts/GameToken.sol) funtion ```getTotalSupply() and getBurnSupply()```

#### 9. Root Page 
[Code](https://github.com/Mahmadabid/invader-with-imx/blob/master/src/pages/_app.tsx)

This page fetches User Data and handles login ensuring page remains the same after reload It handles both metamask and immutable passport. It also handles open graph for social media cards.

