output "cloudfront_url" {
  description = "CloudFront distribution URL"
  value       = module.cloudfront.domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = module.s3.bucket_id
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN"
  value       = module.acm.certificate_arn
}
