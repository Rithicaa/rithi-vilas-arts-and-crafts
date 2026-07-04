output "bucket_id" {
  value = aws_s3_bucket.spa.id
}

output "bucket_arn" {
  value = aws_s3_bucket.spa.arn
}

output "bucket_regional_domain_name" {
  value = aws_s3_bucket.spa.bucket_regional_domain_name
}
