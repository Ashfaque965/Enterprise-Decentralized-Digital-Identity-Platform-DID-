# Restrict access to database pool connection configuration variables
path "secret/data/production/database" {
  capabilities = ["read"]
}

# Grant issuance engines exclusive permission to pass cryptographic credentials over HSM signing parameters
path "transit/sign/nexuscore-issuer-key" {
  capabilities = ["update"]
}

# Block all operations from modifying system telemetry audit paths
path "secret/data/production/audit-logs" {
  capabilities = ["deny"]
}