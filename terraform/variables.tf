variable "aws_region" {
  description = "Primary AWS region"
  type        = string
  default     = "ap-southeast-2"
}

variable "domain_name" {
  description = "Root domain name (e.g. example.com)"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name for SPA assets"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev | prod)"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "environment must be dev or prod."
  }
}

variable "hosted_zone_id" {
  description = "Route 53 hosted zone ID for the domain"
  type        = string
}
