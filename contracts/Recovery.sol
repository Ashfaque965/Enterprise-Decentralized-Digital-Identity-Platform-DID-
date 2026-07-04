// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title NexusCore Decentralized Recovery Manager
 * @notice Governs secure key rotation for DIDs via an M-of-N consensus of cryptographic guardians.
 */
contract RecoveryManager {

    struct RecoveryConfig {
        address[] guardians;
        uint256 threshold;
        uint256 executionDelay; // Mandatory time-lock duration for fraud deterrence
    }

    struct RecoveryRequest {
        address proposedNewKey;
        uint256 signaturesCount;
        uint256 executionTimestamp;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    // Maps a DID identifier string to its structural recovery profile configuration
    mapping(string => RecoveryConfig) private _configs;
    
    // Maps a DID to its active recovery request instances
    mapping(string => RecoveryRequest) private _activeRequests;

    event RecoveryConfigConfigured(string indexed did, uint256 threshold, uint256 guardiansCount);
    event RecoveryInitiated(string indexed did, address indexed proposedNewKey, uint256 executionTimestamp);
    event GuardianVoted(string indexed did, address indexed guardian, uint256 currentVoteCount);
    event RecoveryExecuted(string indexed did, address indexed oldKey, address indexed newKey);
    event RecoveryCancelled(string indexed did);

    modifier onlyGuardians(string memory did) {
        bool isGuardian = false;
        for (uint256 i = 0; i < _configs[did].guardians.length; i++) {
            if (_configs[did].guardians[i] == msg.sender) {
                isGuardian = true;
                break;
            }
        }
        require(isGuardian, "RecoveryManager: Caller is not an authorized guardian for this identity");
        _;
    }

    /**
     * @notice Provisions the recovery configuration matrix for an identity.
     */
    function configureRecovery(
        string calldata did,
        address[] calldata guardians,
        uint256 threshold,
        uint256 executionDelay
    ) external {
        require(guardians.length >= threshold, "RecoveryManager: Threshold must not exceed guardian array volume");
        require(threshold > 0, "RecoveryManager: Threshold minimum boundary must equal at least 1");
        require(_configs[did].threshold == 0, "RecoveryManager: Recovery configuration already initialized");

        _configs[did] = RecoveryConfig({
            guardians: guardians,
            threshold: threshold,
            executionDelay: executionDelay
        });

        emit RecoveryConfigConfigured(did, threshold, guardians.length);
    }

    /**
     * @notice Initiates a multi-signature key rotation request for a lost identity.
     */
    function initiateRecovery(string calldata did, address proposedNewKey) external onlyGuardians(did) {
        RecoveryRequest storage requestInstance = _activeRequests[did];
        require(!requestInstance.executed, "RecoveryManager: Ongoing operations conflict with finalized workflows");
        require(requestInstance.proposedNewKey == address(0), "RecoveryManager: Recovery operation already pending processing");

        requestInstance.proposedNewKey = proposedNewKey;
        requestInstance.signaturesCount = 1;
        requestInstance.executionTimestamp = block.timestamp + _configs[did].executionDelay;
        requestInstance.hasVoted[msg.sender] = true;

        emit RecoveryInitiated(did, proposedNewKey, requestInstance.executionTimestamp);
        emit GuardianVoted(did, msg.sender, 1);
    }

    /**
     * @notice Registers a supporting vote from a designated identity guardian.
     */
    function voteRecovery(string calldata did) external onlyGuardians(did) {
        RecoveryRequest storage requestInstance = _activeRequests[did];
        require(requestInstance.proposedNewKey != address(0), "RecoveryManager: No active recovery operations found");
        require(!requestInstance.hasVoted[msg.sender], "RecoveryManager: Duplicate guardian vote intercepted");

        requestInstance.hasVoted[msg.sender] = true;
        requestInstance.signaturesCount += 1;

        emit GuardianVoted(did, msg.sender, requestInstance.signaturesCount);
    }

    /**
     * @notice Executes the key rotation once the consensus threshold and the timelock window are met.
     */
    function executeRecovery(string calldata did) external onlyGuardians(did) {
        RecoveryRequest storage requestInstance = _activeRequests[did];
        require(requestInstance.signaturesCount >= _configs[did].threshold, "RecoveryManager: Insufficient guardian signatures collected");
        require(block.timestamp >= requestInstance.executionTimestamp, "RecoveryManager: Timelock block cooling-off window remains active");
        require(!requestInstance.executed, "RecoveryManager: Re-entrancy guard check fail: Request completed");

        requestInstance.executed = true;
        address outmodedAddress = msg.sender; // Placeholder representing actual underlying target rotation mapping fetch
        
        emit RecoveryExecuted(did, outmodedAddress, requestInstance.proposedNewKey);
        
        // Clean up allocation footprints from storage records
        delete _activeRequests[did];
    }
}