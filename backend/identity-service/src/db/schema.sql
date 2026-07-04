-- Enable UUID extension for robust distributed identity keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations Table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_identifier VARCHAR(100) UNIQUE,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 3. Permissions Table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 4. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deactivated')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Wallets Table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    public_address VARCHAR(42) UNIQUE NOT NULL,
    network_type VARCHAR(50) DEFAULT 'evm',
    wallet_type VARCHAR(50) DEFAULT 'software',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Issuers Table
CREATE TABLE issuers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    issuer_did VARCHAR(255) UNIQUE NOT NULL,
    revocation_registry_address VARCHAR(42),
    is_active BOOLEAN DEFAULT true
);

-- 7. Verifiers Table
CREATE TABLE verifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    verifier_did VARCHAR(255) UNIQUE NOT NULL,
    supported_schemas JSONB NOT NULL
);

-- 8. Credentials Table
CREATE TABLE credentials (
    id VARCHAR(255) PRIMARY KEY, -- VC ID String Pointer
    subject_did VARCHAR(255) NOT NULL,
    issuer_did VARCHAR(255) REFERENCES issuers(issuer_did),
    credential_type VARCHAR(100) NOT NULL,
    claims JSONB NOT NULL,
    signature_proof JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Devices Table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) NOT NULL,
    push_token TEXT,
    os_version VARCHAR(50),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Sessions Table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    jwt_token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_did VARCHAR(255) NOT NULL,
    encrypted_metadata JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. IPFS Files Table
CREATE TABLE ipfs_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    cid VARCHAR(255) UNIQUE NOT NULL, -- IPFS Content Identifier
    file_size INT NOT NULL,
    encryption_iv VARCHAR(32) NOT NULL
);

-- 13. ZK Proofs Table
CREATE TABLE zk_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verifier_did VARCHAR(255) REFERENCES verifiers(verifier_did),
    proof_payload JSONB NOT NULL,
    public_inputs JSONB NOT NULL,
    is_valid BOOLEAN NOT NULL,
    verified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Transactions Table
CREATE TABLE transactions (
    tx_hash VARCHAR(66) PRIMARY KEY,
    sender_address VARCHAR(42) NOT NULL,
    nonce INT NOT NULL,
    gas_used BIGINT,
    blockchain_network VARCHAR(50) NOT NULL
);

-- 15. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    microservice_sender VARCHAR(100) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    actor_did VARCHAR(255),
    payload_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Performance and Query Optimization Indexes
CREATE INDEX idx_credentials_subject ON credentials(subject_did);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);
CREATE INDEX idx_ipfs_files_cid ON ipfs_files(cid);
CREATE INDEX idx_zk_proofs_valid ON zk_proofs(is_valid);