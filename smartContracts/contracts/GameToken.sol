// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC20, ERC20Burnable, Ownable {
    uint256 public totalBurned;

    mapping(address => uint256) private burnedAmounts;
    address[] private allBurnedAddresses;

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
        burnedAmounts[msg.sender] += amount;

        if (burnedAmounts[msg.sender] == amount) {
            allBurnedAddresses.push(msg.sender);
        }
    }

    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
        totalBurned += amount;
    }

    function getBurnedAmount(address account) external view returns (uint256) {
        return burnedAmounts[account];
    }

    function getBurnedAmounts() external view returns (address[] memory, uint256[] memory) {
        uint256 length = allBurnedAddresses.length;
        address[] memory addresses = new address[](length);
        uint256[] memory amounts = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            address account = allBurnedAddresses[i];
            addresses[i] = account;
            amounts[i] = burnedAmounts[account];
        }

        return (addresses, amounts);
    }

    function getAllBurnedAddresses() external view returns (address[] memory) {
        return allBurnedAddresses;
    }

    address public swapContract;

    function setSwapContract(address _swapContract) external onlyOwner {
        swapContract = _swapContract;
    }
}
