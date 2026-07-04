terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "nexuscore-global-terraform-state"
    key            = "identity/production/core.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "nexuscore-state-locks"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = "Production"
      Project     = "NexusCore-Identity"
      ManagedBy   = "Terraform"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# AWS Aurora PostgreSQL Serverless v2 Cluster Topology
resource "aws_rds_cluster" "identity_db_cluster" {
  cluster_identifier      = "nexuscore-identity-prod-db"
  engine                  = "aurora-postgresql"
  engine_version          = "16.1"
  database_name           = "nexuscore_identity"
  master_username         = "nexus_admin"
  master_password         = var.db_root_password
  storage_encrypted       = true
  deletion_protection     = true
  backup_retention_period = 30
  preferred_backup_window = "02:00-03:00"

  serverless_v2_scaling_configuration {
    max_capacity = 64.0
    min_capacity = 2.0
  }
}

resource "aws_rds_cluster_instance" "identity_db_instances" {
  count              = 3
  identifier         = "nexuscore-identity-prod-db-${count.index}"
  cluster_identifier = aws_rds_cluster.identity_db_cluster.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.identity_db_cluster.engine
  engine_version     = aws_rds_cluster.identity_db_cluster.engine_version
}

# GCP Bucket Definition for Encrypted Verifiable Claims Archive
resource "google_storage_bucket" "claims_cold_archive" {
  name                        = "nexuscore-identity-claims-cold-archive"
  location                    = var.gcp_region
  storage_class               = "ARCHIVE"
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}