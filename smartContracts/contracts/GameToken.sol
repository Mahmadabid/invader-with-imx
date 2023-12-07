// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC20, ERC20Burnable, Ownable {

    constructor() ERC20("Invader Pixel Token", "IPX") Ownable(msg.sender) {
        // Initialize total supply to zero
        _mint(msg.sender, 0);
    }

    // Mint new tokens, only callable by swapContract
    function mintBySwapContract(address to, uint256 amount) external {
        require(msg.sender == swapContract, "Not authorized to mint");
        _mint(to, amount);
    }

    // Mint tokens by the owner
    function mintByOwner(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    // Swap contract address
    address public swapContract;

    // Set the swapContract address (only owner)
    function setSwapContract(address _swapContract) external onlyOwner {
        swapContract = _swapContract;
    }
}
