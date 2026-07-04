// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CredentialVerifier {
    event ProofVerifiedEvent(bytes32 indexed sessionChallenge, bool verificationStatus);

    function assertCryptographicVerificationProof(bytes32 challenge, bytes calldata signature, address expectedSigner) external returns (bool) {
        bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", challenge));
        
        (bytes32 r, bytes32 s, uint8 v) = deconstructSignature(signature);
        address derivedSigner = ecrecover(messageDigest, v, r, s);
        
        bool success = (derivedSigner == expectedSigner && expectedSigner != address(0));
        emit ProofVerifiedEvent(challenge, success);
        return success;
    }

    function deconstructSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Malformed signature payload data structure length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}