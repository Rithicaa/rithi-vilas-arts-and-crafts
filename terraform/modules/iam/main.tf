# ── GitHub Actions OIDC Identity Provider ────────────────────────────────────
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1", "1c58a3a8518e8759bf075b76b750d4f2df264fcd"]

  lifecycle {
    prevent_destroy = true
  }
}

locals {
  oidc_provider_arn = aws_iam_openid_connect_provider.github.arn
}

# ── Trust Policy ─────────────────────────────────────────────────────────────
data "aws_iam_policy_document" "github_actions_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:*"]
    }
  }
}

# ── Deploy Role ───────────────────────────────────────────────────────────────
resource "aws_iam_role" "github_actions_deploy" {
  name               = "${var.project_name}-github-actions-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_actions_trust.json

  tags = {
    Project     = var.project_name
    ManagedBy   = "terraform"
    Purpose     = "github-actions-oidc"
  }
}

# ── Least-Privilege Deploy Policy ────────────────────────────────────────────
data "aws_iam_policy_document" "deploy_permissions" {
  # S3 — sync built assets
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetBucketLocation",
      "s3:GetBucketVersioning",
      "s3:PutBucketVersioning",
      "s3:CreateBucket",
      "s3:GetBucketPolicy",
      "s3:PutBucketPolicy",
      "s3:GetBucketPublicAccessBlock",
      "s3:PutBucketPublicAccessBlock",
      "s3:GetEncryptionConfiguration",
      "s3:PutEncryptionConfiguration",
      "s3:GetBucketTagging",
      "s3:PutBucketTagging",
      "s3:GetBucketWebsite",
      "s3:GetBucketCORS",
      "s3:GetBucketObjectLockConfiguration",
      "s3:GetLifecycleConfiguration",
      "s3:GetBucketAcl",
      "s3:PutBucketAcl"
    ]
    resources = [
      "arn:aws:s3:::${var.bucket_name_prod}",
      "arn:aws:s3:::${var.bucket_name_prod}/*",
      "arn:aws:s3:::${var.bucket_name_dev}",
      "arn:aws:s3:::${var.bucket_name_dev}/*",
      "arn:aws:s3:::${var.tf_state_bucket}",
      "arn:aws:s3:::${var.tf_state_bucket}/*"
    ]
  }

  # CloudFront — invalidation + distribution management
  statement {
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetDistribution",
      "cloudfront:GetDistributionConfig",
      "cloudfront:UpdateDistribution",
      "cloudfront:CreateDistribution",
      "cloudfront:DeleteDistribution",
      "cloudfront:TagResource",
      "cloudfront:ListDistributions",
      "cloudfront:CreateOriginAccessControl",
      "cloudfront:GetOriginAccessControl",
      "cloudfront:DeleteOriginAccessControl",
      "cloudfront:ListOriginAccessControls",
      "cloudfront:CreateResponseHeadersPolicy",
      "cloudfront:GetResponseHeadersPolicy",
      "cloudfront:DeleteResponseHeadersPolicy",
      "cloudfront:ListResponseHeadersPolicies"
    ]
    resources = ["*"]
  }

  # ACM — certificate management (us-east-1 for CloudFront)
  statement {
    effect = "Allow"
    actions = [
      "acm:RequestCertificate",
      "acm:DescribeCertificate",
      "acm:DeleteCertificate",
      "acm:ListCertificates",
      "acm:AddTagsToCertificate",
      "acm:ListTagsForCertificate"
    ]
    resources = ["*"]
  }

  # Route 53 — DNS validation + alias records
  statement {
    effect = "Allow"
    actions = [
      "route53:GetHostedZone",
      "route53:ListHostedZones",
      "route53:ChangeResourceRecordSets",
      "route53:ListResourceRecordSets",
      "route53:GetChange"
    ]
    resources = ["*"]
  }

  # DynamoDB — Terraform state locking
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem"
    ]
    resources = ["arn:aws:dynamodb:us-east-1:*:table/terraform-state-lock"]
  }

  # IAM — read-only for Terraform plan (no privilege escalation)
  statement {
    effect = "Allow"
    actions = [
      "iam:GetOpenIDConnectProvider",
      "iam:GetRole",
      "iam:GetRolePolicy",
      "iam:GetPolicy",
      "iam:GetPolicyVersion",
      "iam:ListAttachedRolePolicies",
      "iam:ListRolePolicies"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "deploy_permissions" {
  name        = "${var.project_name}-github-actions-deploy-policy"
  description = "Least-privilege policy for GitHub Actions OIDC deploy role"
  policy      = data.aws_iam_policy_document.deploy_permissions.json

  tags = {
    Project   = var.project_name
    ManagedBy = "terraform"
  }
}

resource "aws_iam_role_policy_attachment" "deploy_permissions" {
  role       = aws_iam_role.github_actions_deploy.name
  policy_arn = aws_iam_policy.deploy_permissions.arn
}
