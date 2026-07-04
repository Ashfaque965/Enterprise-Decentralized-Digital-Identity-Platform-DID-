// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AuditRegistry {
    struct AuditLog {
        string microserviceId;   // Source identifier string (e.g., "auth-service")
        bytes32 operationalHash; // Hash of off-chain events/payload
        address actor;           // Signing operator address
        uint256 timestamp;       // Execution block time
    }

    mapping(uint256 => AuditLog) private _logs;
    uint256 public totalLogs;

    event AuditLogged(
        uint256 indexed index, 
        string microserviceId, 
        bytes32 indexed operationalHash, 
        address indexed actor
    );

    /**
     * @notice Commits an action signature permanently to the blockchain ledger.
     */
    function commitAuditEntry(
        string calldata microserviceId, 
        bytes32 operationalHash
    ) external {
        totalLogs++;
        _logs[totalLogs] = AuditLog({
            microserviceId: microserviceId,
            operationalHash: operationalHash,
            actor: msg.sender,
            timestamp: block.timestamp
        });

        emit AuditLogged(totalLogs, microserviceId, operationalHash, msg.sender);
    }

    /**
     * @notice External view function for verification software to audit history records.
     */
    function getAuditEntry(uint256 index) external view returns (
        string memory microserviceId,
        bytes32 operationalHash,
        address actor,
        uint256 timestamp
    ) {
        require(index > 0 && index <= totalLogs, "AuditRegistry: Target log index out of bounds");
        AuditLog memory log = _logs[index];
        return (log.microserviceId, log.operationalHash, log.actor, log.timestamp);
    }
}