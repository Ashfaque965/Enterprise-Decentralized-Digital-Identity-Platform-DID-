CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Decentralized Identifiers (DIDs)
CREATE TABLE dids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    did_uri VARCHAR(255) UNIQUE NOT NULL,
    controller VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- JSON-LD DID Document Storage
CREATE TABLE did_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    did_id UUID REFERENCES dids(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    document_payload JSONB NOT NULL,
    is_latest BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- W3C Verifiable Credentials
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issuer_did VARCHAR(255) NOT NULL,
    subject_did VARCHAR(255) NOT NULL,
    credential_type VARCHAR(100) NOT NULL,
    schema_uri VARCHAR(255) NOT NULL,
    claims_payload JSONB NOT NULL,
    proof_payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'VALID' CHECK (status IN ('VALID', 'SUSPENDED', 'REVOKED', 'EXPIRED')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tamper-Proof System Audit Logs
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id VARCHAR(255) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    payload_hash CHAR(64) NOT NULL, -- SHA-256 integrity validation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_dids_uri ON dids(did_uri);
CREATE INDEX idx_credentials_subject ON credentials(subject_did);
CREATE INDEX idx_credentials_issuer ON credentials(issuer_did);
CREATE INDEX idx_did_documents_jsonb ON did_documents USING gin (document_payload);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type, created_at DESC);