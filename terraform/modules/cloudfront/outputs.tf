output "domain_name" {
  value = aws_cloudfront_distribution.spa.domain_name
}

output "hosted_zone_id" {
  value = aws_cloudfront_distribution.spa.hosted_zone_id
}

output "distribution_id" {
  value = aws_cloudfront_distribution.spa.id
}

output "distribution_arn" {
  value = aws_cloudfront_distribution.spa.arn
}
