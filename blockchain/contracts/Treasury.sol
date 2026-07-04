// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Treasury {
    address public governanceTimelock;
    
    event FundsDeposited(address indexed sender, uint256 amount);
    event FundsAllocated(address indexed recipient, uint256 amount, string purpose);

    modifier onlyGovernance() {
        require(msg.sender == governanceTimelock, "Treasury: Action requires governance clearance");
        _;
    }

    constructor(address _governanceTimelock) {
        require(_governanceTimelock != address(0), "Treasury: Invalid address");
        governanceTimelock = _governanceTimelock;
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Releases system funds to verified recipients or providers based on governance votes.
     */
    function allocateFunds(
        address payable recipient, 
        uint256 amount, 
        string calldata purpose
    ) external onlyGovernance {
        require(amount <= address(this).balance, "Treasury: Insufficient balance available");
        recipient.transfer(amount);
        emit FundsAllocated(recipient, amount, purpose);
    }
}