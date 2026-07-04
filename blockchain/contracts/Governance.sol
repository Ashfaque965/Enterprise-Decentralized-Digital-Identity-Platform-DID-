// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityDAO is Ownable {
    enum ProposalState { Pending, Active, Defeated, Succeeded, Executed }

    struct Proposal {
        uint256 id;
        address targetContract;
        bytes transactionData;
        string description;
        uint256 voteFor;
        uint256 voteAgainst;
        uint256 endBlock;
        ProposalState state;
        mapping(address => bool) hasVoted;
    }

    // Mapping of identity members holding voting weight (Reputation SBT metrics)
    mapping(address => uint256) public votingWeight;
    mapping(uint256 => Proposal) public proposals;
    uint256 public totalProposals;
    uint256 public constant VOTING_PERIOD_BLOCKS = 5760; // Approx 24 Hours

    event ProposalCreated(uint256 indexed id, address target, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id);

    constructor() Ownable(msg.sender) {}

    function registerVoter(address voter, uint256 weight) external onlyOwner {
        votingWeight[voter] = weight;
    }

    /**
     * @notice Creates a new governance proposal to modify system properties.
     */
    function submitProposal(
        address target, 
        bytes calldata data, 
        string calldata description
    ) external returns (uint256) {
        require(votingWeight[msg.sender] > 0, "DAO: Caller holds no voting power");
        
        totalProposals++;
        Proposal storage p = proposals[totalProposals];
        p.id = totalProposals;
        p.targetContract = target;
        p.transactionData = data;
        p.description = description;
        p.endBlock = block.number + VOTING_PERIOD_BLOCKS;
        p.state = ProposalState.Active;

        emit ProposalCreated(totalProposals, target, description);
        return totalProposals;
    }

    /**
     * @notice Casts a vote on an active system parameter proposal.
     */
    function castVote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(p.state == ProposalState.Active, "DAO: Voting window closed");
        require(block.number <= p.endBlock, "DAO: Proposal blocks exceeded");
        require(!p.hasVoted[msg.sender], "DAO: Account already voted");

        uint256 weight = votingWeight[msg.sender];
        require(weight > 0, "DAO: Zero voting weight");

        p.hasVoted[msg.sender] = true;
        if (support) {
            p.voteFor += weight;
        } else {
            p.voteAgainst += weight;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    /**
     * @notice Executes a passed proposal, running the low-level payload securely.
     */
    function executeProposal(uint256 proposalId) external bytes32 {
        Proposal storage p = proposals[proposalId];
        require(p.state == ProposalState.Active, "DAO: Invalid proposal state");
        require(block.number > p.endBlock, "DAO: Voting period still active");
        require(p.voteFor > p.voteAgainst, "DAO: Proposal failed to pass quorum");

        p.state = ProposalState.Executed;

        // Low-level address call execution routine
        (bool success, ) = p.targetContract.call(p.transactionData);
        require(success, "DAO: Call execution reverted on target");

        emit ProposalExecuted(proposalId);
    }
}