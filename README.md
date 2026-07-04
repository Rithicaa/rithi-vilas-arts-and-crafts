# Rithi Vilas Arts and Crafts Portfolio

A production-grade Single Page Application (SPA) built with **React + Vite + TypeScript**, deployed to AWS using **CloudFront + S3 + ACM + Route 53**, with infrastructure managed by **Terraform** and configuration managed by **Ansible**. The CI/CD pipeline runs entirely on **GitHub Actions**.

---

## Architecture Overview

```
User → Route 53 (DNS) → CloudFront (CDN + HTTPS + Security Headers)
                              ↓
                        S3 Bucket (private, OAC-only access)
                              ↓
                         SPA (index.html + hashed assets)
```

- **Route 53** — DNS with A alias records pointing to CloudFront
- **ACM** — SSL/TLS certificate (us-east-1, DNS validated, auto-renewing)
- **CloudFront** — CDN with HTTPS-only, TLSv1.2_2021+, security response headers, SPA 404→200 fallback
- **S3** — Private bucket, public access fully blocked, OAC (Origin Access Control) enforced, AES-256 encryption, versioning enabled
- **GitHub Actions** — Build → Security scan → Terraform plan/apply → Ansible deploy

---

## Project Structure

```
.
├── src/                        # React + TypeScript source
├── dist/                       # Build output (git-ignored)
├── terraform/
│   ├── main.tf                 # Root module wiring
│   ├── variables.tf
│   ├── outputs.tf
│   ├── modules/
│   │   ├── s3/                 # Private S3 bucket + OAC policy
│   │   ├── cloudfront/         # Distribution + security headers
│   │   ├── acm/                # Certificate + DNS validation
│   │   └── route53/            # A alias records
│   └── environments/
│       ├── dev/terraform.tfvars
│       └── prod/terraform.tfvars
├── ansible/
│   ├── site.yml                # Main playbook
│   ├── vars/config.yml         # Non-sensitive config
│   ├── inventory/hosts
│   └── roles/
│       ├── app-config/         # S3 sync + CloudFront invalidation
│       └── security-hardening/ # Pre-deploy security assertions
├── .github/workflows/
│   └── deploy.yml              # Full CI/CD pipeline
├── docs/
│   └── FUTURE_ENHANCEMENTS.md
└── .env.example                # Environment variable template
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 22 |
| npm | >= 10 |
| Terraform | >= 1.5 |
| Ansible | >= 2.14 |
| AWS CLI | >= 2 |

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Production build
npm run build
```

---

## Infrastructure Setup (First Time)

### 1. Bootstrap Terraform remote state

Create an S3 bucket and DynamoDB table for Terraform state before running any `terraform apply`:

```bash
# Create state bucket (replace placeholders)
aws s3api create-bucket \
  --bucket <YOUR_TF_STATE_BUCKET> \
  --region ap-southeast-2 \
  --create-bucket-configuration LocationConstraint=ap-southeast-2

# Enable versioning on state bucket
aws s3api put-bucket-versioning \
  --bucket <YOUR_TF_STATE_BUCKET> \
  --versioning-configuration Status=Enabled
```

### 2. Configure GitHub Actions secrets

Add the following secrets in your GitHub repository settings (`Settings → Secrets and variables → Actions`):

| Secret | Description |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | IAM role ARN for GitHub Actions OIDC |
| `AWS_REGION` | AWS region (e.g. `ap-southeast-2`) |
| `TF_STATE_BUCKET` | S3 bucket name for Terraform state |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID (after first apply) |

> **Never** commit credentials, ARNs, or account IDs to source control.

### 3. Set up GitHub Actions OIDC

Create an IAM OIDC identity provider for `token.actions.githubusercontent.com` and an IAM role with a trust policy scoped to your repository. Attach only the minimum permissions required (S3, CloudFront, ACM, Route53, Terraform state bucket).

### 4. Update tfvars

Edit `terraform/environments/prod/terraform.tfvars` and `terraform/environments/dev/terraform.tfvars` with your domain name and Route 53 hosted zone ID.

### 5. Run Terraform manually (first time only)

```bash
cd terraform

terraform init \
  -backend-config="bucket=<YOUR_TF_STATE_BUCKET>" \
  -backend-config="key=prod/terraform.tfstate" \
  -backend-config="region=ap-southeast-2"

terraform plan -var-file="environments/prod/terraform.tfvars"
terraform apply -var-file="environments/prod/terraform.tfvars"
```

---

## CI/CD Pipeline

The GitHub Actions pipeline (`deploy.yml`) runs automatically:

| Trigger | Jobs |
|---|---|
| Pull Request to `main` | Build → Security Scan → Terraform Plan |
| Push to `develop` | Build → Security Scan → Terraform Plan → Deploy (dev) |
| Push to `main` | Build → Security Scan → Terraform Plan → Deploy (prod) |

### Pipeline stages

1. **Build** — `npm ci` → `tsc --noEmit` → `vite build` → upload `dist/` artifact
2. **Security Scan** — `npm audit --audit-level=high` + Gitleaks secrets scan
3. **Terraform Plan** — Init, validate, plan against environment tfvars
4. **Deploy** — Terraform apply → Ansible sync to S3 → CloudFront invalidation

---

## Security Practices

- S3 bucket has all public access blocked; only CloudFront OAC can read objects
- CloudFront enforces HTTPS-only with TLSv1.2_2021 minimum
- Security response headers: HSTS, X-Frame-Options, X-Content-Type-Options, CSP, XSS-Protection
- ACM certificate uses DNS validation and auto-renews
- GitHub Actions uses OIDC (no long-lived AWS keys stored as secrets)
- Gitleaks scans every push for accidentally committed secrets
- `npm audit` blocks deployment on high/critical vulnerabilities
- Ansible pre-deploy assertions verify security posture before syncing assets

---

## Cost Considerations

- **S3** — Pay only for storage and GET requests (minimal for a SPA)
- **CloudFront** — PriceClass_100 (US, Canada, Europe only) keeps costs low
- **ACM** — Free for certificates used with CloudFront
- **Route 53** — ~$0.50/month per hosted zone + $0.40/million queries
- **GitHub Actions** — Free tier covers most usage for a small project

---

## Future Enhancements

See [docs/FUTURE_ENHANCEMENTS.md](docs/FUTURE_ENHANCEMENTS.md) for a full roadmap covering performance, security, observability, CI/CD improvements, and application features.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a Pull Request against `main` — the pipeline will run automatically

---

## License

MIT
