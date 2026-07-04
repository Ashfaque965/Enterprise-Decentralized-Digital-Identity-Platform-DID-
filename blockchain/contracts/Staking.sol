// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Staking {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public lockupPeriod;

    event StakingLocked(address indexed user, uint256 amount, uint256 unlockTime);
    event StakingWithdrawn(address indexed user, uint256 amount);

    function stakeIdentityCollateral(uint256 duration) external payable {
        require(msg.value > 0, "Staking: minimum staking threshold missed");
        stakes[msg.sender] += msg.value;
        lockupPeriod[msg.sender] = block.timestamp + duration;
        emit StakingLocked(msg.sender, msg.value, lockupPeriod[msg.sender]);
    }

    function withdrawCollateral() external {
        require(block.timestamp >= lockupPeriod[msg.sender], "Staking: asset value currently locked");
        uint256 amount = stakes[msg.sender];
        require(amount > 0, "Staking: target identity has zero assets");

        stakes[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit StakingWithdrawn(msg.sender, amount);
    }
}