resource "aws_acm_certificate" "this" {
  domain_name               = var.domain_name
  subject_alternative_names = [
    "www.${var.domain_name}",
    "*.${var.domain_name}"
  ]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    ManagedBy = "terraform"
  }
}

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.validation : r.fqdn]
}

data "aws_route53_zone" "this" {
  zone_id      = var.hosted_zone_id
  private_zone = false
}

locals {
  validation_domains = [
    var.domain_name,
    "www.${var.domain_name}",
    "*.${var.domain_name}"
  ]
}

resource "aws_route53_record" "validation" {
  for_each = {
    for domain in local.validation_domains : domain => {
      name   = tolist([for dvo in aws_acm_certificate.this.domain_validation_options : dvo.resource_record_name if dvo.domain_name == domain])[0]
      type   = tolist([for dvo in aws_acm_certificate.this.domain_validation_options : dvo.resource_record_type if dvo.domain_name == domain])[0]
      record = tolist([for dvo in aws_acm_certificate.this.domain_validation_options : dvo.resource_record_value if dvo.domain_name == domain])[0]
    }
  }

  allow_overwrite = true
  zone_id         = data.aws_route53_zone.this.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
}
