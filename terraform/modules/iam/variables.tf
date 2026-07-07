variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "github_repo" {
  description = "GitHub repo in owner/repo format (e.g. Rithicaa/rithi-vilas-arts-and-crafts)"
  type        = string
}

variable "bucket_name_prod" {
  description = "Prod S3 bucket name"
  type        = string
}

variable "bucket_name_dev" {
  description = "Dev S3 bucket name"
  type        = string
}

variable "tf_state_bucket" {
  description = "Terraform state S3 bucket name"
  type        = string
}
