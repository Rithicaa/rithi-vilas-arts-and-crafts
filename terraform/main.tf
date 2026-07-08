terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    # Populated via -backend-config in CI or environments
  }
}

provider "aws" {
  region = var.aws_region
}

# ACM must be in us-east-1 for CloudFront
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

module "acm" {
  source         = "./modules/acm"
  domain_name    = var.domain_name
  hosted_zone_id = var.hosted_zone_id
  providers      = { aws = aws.us_east_1 }
}

module "s3" {
  source      = "./modules/s3"
  bucket_name = var.bucket_name
  environment = var.environment
}

module "cloudfront" {
  source              = "./modules/cloudfront"
  bucket_id           = module.s3.bucket_id
  bucket_domain_name  = module.s3.bucket_regional_domain_name
  acm_certificate_arn = module.acm.certificate_arn
  domain_name         = var.domain_name
  environment         = var.environment
}

module "route53" {
  source                = "./modules/route53"
  domain_name           = var.domain_name
  cloudfront_domain     = module.cloudfront.domain_name
  cloudfront_zone_id    = module.cloudfront.hosted_zone_id
  hosted_zone_id        = var.hosted_zone_id
}

module "iam" {
  source           = "./modules/iam"
  project_name     = "rithi-vilas-arts-and-crafts"
  github_repo      = var.github_repo
  bucket_name_prod = "rithi-vilas-arts-crafts-prod"
  bucket_name_dev  = "rithi-vilas-arts-crafts-dev"
  tf_state_bucket  = var.tf_state_bucket
}
