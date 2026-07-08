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
  # S3 — sync built assets + terraform state + full bucket management
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
      "s3:DeleteBucketPolicy",
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
      "s3:PutBucketAcl",
      "s3:GetAccelerateConfiguration",
      "s3:PutAccelerateConfiguration",
      "s3:GetBucketRequestPayment",
      "s3:GetBucketLogging",
      "s3:GetReplicationConfiguration",
      "s3:ListBucketMultipartUploads",
      "s3:GetBucketOwnershipControls",
      "s3:PutBucketOwnershipControls"
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

  # CloudFront — moved to separate policy (cloudfront_permissions)
  # to stay within IAM 6144 character policy size limit

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
      "route53:GetChange",
      "route53:ListTagsForResource",
      "route53:ListTagsForResources"
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
      "iam:ListRolePolicies",
      "iam:ListPolicyVersions"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "deploy_permissions" {
  name        = "${var.project_name}-github-actions-deploy-policy"
  description = "Core deploy permissions for GitHub Actions OIDC role"
  policy      = data.aws_iam_policy_document.deploy_permissions.json

  tags = {
    Project   = var.project_name
    ManagedBy = "terraform"
  }
}

data "aws_iam_policy_document" "cloudfront_permissions" {
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
      "cloudfront:UntagResource",
      "cloudfront:ListTagsForResource",
      "cloudfront:ListDistributions",
      "cloudfront:CreateOriginAccessControl",
      "cloudfront:GetOriginAccessControl",
      "cloudfront:DeleteOriginAccessControl",
      "cloudfront:UpdateOriginAccessControl",
      "cloudfront:ListOriginAccessControls",
      "cloudfront:CreateResponseHeadersPolicy",
      "cloudfront:GetResponseHeadersPolicy",
      "cloudfront:DeleteResponseHeadersPolicy",
      "cloudfront:UpdateResponseHeadersPolicy",
      "cloudfront:ListResponseHeadersPolicies"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "cloudfront_permissions" {
  name        = "${var.project_name}-github-actions-cloudfront-policy"
  description = "CloudFront permissions for GitHub Actions OIDC role"
  policy      = data.aws_iam_policy_document.cloudfront_permissions.json

  tags = {
    Project   = var.project_name
    ManagedBy = "terraform"
  }
}

resource "aws_iam_role_policy_attachment" "deploy_permissions" {
  role       = aws_iam_role.github_actions_deploy.name
  policy_arn = aws_iam_policy.deploy_permissions.arn
}

resource "aws_iam_role_policy_attachment" "cloudfront_permissions" {
  role       = aws_iam_role.github_actions_deploy.name
  policy_arn = aws_iam_policy.cloudfront_permissions.arn
}
