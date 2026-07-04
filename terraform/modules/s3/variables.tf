variable "bucket_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN for OAC bucket policy"
  type        = string
  default     = ""
}
