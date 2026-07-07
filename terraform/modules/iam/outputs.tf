output "deploy_role_arn" {
  description = "ARN of the GitHub Actions deploy role — set this as AWS_DEPLOY_ROLE_ARN in GitHub secrets"
  value       = aws_iam_role.github_actions_deploy.arn
}

output "oidc_provider_arn" {
  description = "ARN of the GitHub Actions OIDC provider"
  value       = local.oidc_provider_arn
}
