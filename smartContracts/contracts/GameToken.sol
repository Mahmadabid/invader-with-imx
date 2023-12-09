// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC20, ERC20Burnable, Ownable {
    uint256 public totalBurned;

    constructor() ERC20("Invader Pixel Token", "IPX") Ownable(msg.sender) {
        _mint(msg.sender, 0 * 10 ** 18);
    }

    function mintBySwapContract(address to, uint256 amount) external {
        require(msg.sender == swapContract, "Not authorized to mint");
        _mint(to, amount);
    }

    function mintByOwner(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public override {
        super.burn(amount);
        totalBurned += amount;
    }

    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
        totalBurned += amount;
    }

    address public swapContract;

    function setSwapContract(address _swapContract) external onlyOwner {
        swapContract = _swapContract;
    }
}
