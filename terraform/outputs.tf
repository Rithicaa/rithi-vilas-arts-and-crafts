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

output "github_actions_deploy_role_arn" {
  description = "Copy this ARN and set it as AWS_DEPLOY_ROLE_ARN in GitHub Actions secrets"
  value       = module.iam.deploy_role_arn
}
