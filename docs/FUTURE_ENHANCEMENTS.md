# Future Enhancements — Rithi Vilas Arts and Crafts

## 1. Performance & Delivery

| Enhancement | Description | Priority |
|---|---|---|
| CloudFront Functions | Lightweight URL rewrites and A/B testing at edge | High |
| Image Optimisation | Serve WebP/AVIF via CloudFront image optimisation or Lambda@Edge | High |
| HTTP/3 + QUIC | Already enabled via `http2and3`; monitor adoption metrics | Medium |
| Brotli compression | Enable Brotli in addition to gzip for smaller asset transfers | Medium |
| Resource hints | Add `<link rel="preload">` and `<link rel="prefetch">` for critical assets | Low |

---

## 2. Security

| Enhancement | Description | Priority |
|---|---|---|
| AWS WAF | Attach WAF WebACL to CloudFront — rate limiting, geo-blocking, OWASP rules | High |
| AWS Shield Standard | Already included free; evaluate Shield Advanced for DDoS protection | Medium |
| Subresource Integrity (SRI) | Add SRI hashes to all external scripts/styles | High |
| Secrets Manager rotation | Rotate any API keys via AWS Secrets Manager automatic rotation | Medium |
| OIDC fine-grained roles | Scope GitHub Actions IAM role to specific repo/branch conditions | High |
| S3 Object Lock | Enable WORM protection on prod bucket for compliance | Low |
| CloudTrail + GuardDuty | Enable CloudTrail logging and GuardDuty threat detection | High |

---

## 3. Observability & Monitoring

| Enhancement | Description | Priority |
|---|---|---|
| CloudFront access logs | Enable access logs to S3 + Athena for query analysis | High |
| CloudWatch RUM | Real User Monitoring for Core Web Vitals tracking | Medium |
| CloudWatch Alarms | Alarms on 4xx/5xx error rates and cache hit ratio | High |
| AWS X-Ray | Distributed tracing if backend APIs are added | Low |
| Synthetic Canaries | CloudWatch Synthetics for uptime monitoring | Medium |

---

## 4. CI/CD Pipeline

| Enhancement | Description | Priority |
|---|---|---|
| Playwright E2E tests | Add end-to-end tests in the pipeline before deploy | High |
| Lighthouse CI | Automated performance/accessibility scoring on every PR | Medium |
| Terraform drift detection | Scheduled workflow to detect infrastructure drift | Medium |
| Blue/Green deployments | Use CloudFront origin groups for zero-downtime releases | Medium |
| Rollback workflow | One-click rollback GitHub Actions workflow using S3 versioning | High |
| Dependabot | Enable Dependabot for automated dependency updates | High |

---

## 5. Cost Optimisation

| Enhancement | Description | Priority |
|---|---|---|
| S3 Intelligent-Tiering | Move infrequently accessed assets to cheaper storage tiers | Low |
| CloudFront cache tuning | Increase TTLs for hashed assets to reduce origin requests | High |
| Reserved capacity | Evaluate CloudFront savings plans for predictable traffic | Low |
| Cost allocation tags | Tag all resources for per-environment cost breakdown in Cost Explorer | Medium |

---

## 6. Application Features

| Enhancement | Description | Priority |
|---|---|---|
| Product catalogue | Dynamic product listing with categories and filters | High |
| Shopping cart | Client-side cart with local storage persistence | High |
| Contact / enquiry form | Form backed by API Gateway + SES for email delivery | High |
| CMS integration | Headless CMS (e.g. Contentful / Sanity) for content management | Medium |
| i18n / localisation | Multi-language support using react-i18next | Medium |
| Accessibility audit | WCAG 2.1 AA compliance review and remediation | High |
| PWA support | Service worker + manifest for offline capability | Low |

---

## 7. Infrastructure

| Enhancement | Description | Priority |
|---|---|---|
| Multi-region failover | CloudFront origin failover with secondary S3 bucket in another region | Medium |
| Terraform Cloud / Atlantis | Remote state locking and PR-based plan approvals | Medium |
| Ansible Vault | Encrypt sensitive vars at rest using Ansible Vault | High |
| Infrastructure testing | Terratest or Checkov for Terraform policy-as-code validation | Medium |

---

## 8. Developer Experience

| Enhancement | Description | Priority |
|---|---|---|
| Storybook | Component library documentation | Low |
| Husky + lint-staged | Pre-commit hooks for linting and formatting | Medium |
| ESLint + Prettier | Enforce consistent code style | High |
| Vitest | Unit testing framework aligned with Vite | High |

---

_Last updated: 2025 — review quarterly_
