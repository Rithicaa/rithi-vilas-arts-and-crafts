# AWS Reference Architecture — High Level Design
## Rithi Vilas Arts and Crafts

---

## 1. Architecture Overview

```mermaid
graph TD
    subgraph Internet
        User["👤 End User\nBrowser"]
    end

    subgraph DNS["DNS Layer"]
        R53["Amazon Route 53\nHosted Zone: Z07156592IZG07FL53X90\nrithivilasartsandcrafts.org.uk\nA Alias → CloudFront\nwww A Alias → CloudFront"]
    end

    subgraph CDN["Content Delivery Layer — Global Edge"]
        CF["Amazon CloudFront\nDistribution: ESGCW04VAXWWD\nHTTPS-only · TLSv1.2_2021+\nHTTP/2 + HTTP/3\nPriceClass_100 (US · CA · EU)\nSPA 403/404 → index.html\nSecurity Response Headers"]
        ACM["AWS Certificate Manager\nrithivilasartsandcrafts.org.uk\nwww.rithivilasartsandcrafts.org.uk\n*.rithivilasartsandcrafts.org.uk\nus-east-1 · DNS Validated · Auto-renew"]
    end

    subgraph Origin["Origin Layer — us-east-1"]
        S3["Amazon S3\nrithi-vilas-arts-crafts-prod\nPrivate · OAC-only access\nAES-256 encryption\nVersioning enabled\nAll public access blocked"]
        OAC["Origin Access Control\nSigV4 signing\ncloudfront.amazonaws.com only"]
    end

    subgraph Security["Security Layer"]
        IAM["IAM OIDC Provider\ntoken.actions.githubusercontent.com\nGitHub Actions Deploy Role\nTemporary credentials only"]
        HDR["Security Response Headers\nHSTS · X-Frame-Options DENY\nX-Content-Type-Options\nCSP · XSS-Protection\nReferrer-Policy"]
    end

    User -->|"HTTPS Request"| R53
    R53 -->|"A Alias Record"| CF
    CF -->|"TLS · ACM cert"| ACM
    CF -->|"OAC sigv4 · Private"| OAC
    OAC --> S3
    CF --> HDR
    IAM -.->|"Deploy assets"| S3
    IAM -.->|"Invalidate cache"| CF
```

---

## 2. Network & Traffic Flow

```mermaid
sequenceDiagram
    actor User as 👤 User
    participant R53 as Route 53
    participant CF as CloudFront Edge
    participant ACM as ACM (TLS)
    participant S3 as S3 Origin

    User->>R53: DNS lookup rithivilasartsandcrafts.org.uk
    R53-->>User: CNAME → CloudFront domain
    User->>CF: HTTPS GET / (TLSv1.2+)
    CF->>ACM: Validate certificate
    ACM-->>CF: Certificate OK
    CF->>CF: Check edge cache
    alt Cache HIT
        CF-->>User: 200 OK (cached asset)
    else Cache MISS
        CF->>S3: GET object (OAC sigv4)
        S3-->>CF: 200 OK + asset
        CF->>CF: Cache asset at edge
        CF-->>User: 200 OK + Security Headers
    end
    alt SPA route (e.g. /gallery)
        CF->>S3: GET /gallery → 403/404
        S3-->>CF: 403 NoSuchKey
        CF->>CF: Custom error rule → /index.html
        CF-->>User: 200 OK index.html
    end
```

---

## 3. CI/CD Pipeline Architecture

```mermaid
flowchart TD
    subgraph Developer
        DEV["👩‍💻 Engineer\nLocal machine"]
    end

    subgraph GitHub
        REPO["GitHub Repository\nRithicaa/rithi-vilas-arts-and-crafts"]
        PR["Pull Request → main"]
        PUSH_DEV["Push → develop"]
        PUSH_MAIN["Push → main"]
    end

    subgraph GitHubActions["GitHub Actions — ubuntu-latest"]
        B["🔨 Job 1: Build & Test\nnpm ci\ntsc --noEmit\nvite build\nUpload dist artifact"]
        SC["🔒 Job 2: Security Scan\nnpm audit high+critical\nGitleaks secrets scan"]
        TP["📋 Job 3: Terraform Plan\nOIDC → AWS STS\nterraform init\nterraform validate\nterraform plan"]
        D["🚀 Job 4: Deploy prod\nterraform apply\nAnsible S3 sync\nCloudFront invalidation"]
    end

    subgraph AWS
        STS["AWS STS\nOIDC token exchange\nTemporary credentials"]
        TFS["S3 State Bucket\nrithi-vilas-tf-state\nglobal/terraform.tfstate"]
        S3A["S3 App Bucket\nrithi-vilas-arts-crafts-prod"]
        CFA["CloudFront\nCache invalidation /*"]
    end

    DEV -->|git push| REPO
    REPO --> PR & PUSH_DEV & PUSH_MAIN
    PR --> B --> SC --> TP
    PUSH_DEV --> B --> SC --> TP --> D
    PUSH_MAIN --> B --> SC --> TP --> D
    TP -->|OIDC JWT| STS
    D -->|OIDC JWT| STS
    STS -->|Temp credentials| TP & D
    TP <-->|Read state| TFS
    D -->|Write state| TFS
    D -->|aws s3 sync| S3A
    D -->|create-invalidation| CFA
```

---

## 4. Security Architecture

```mermaid
flowchart TD
    subgraph NoCredentials["Zero Long-Lived Credentials"]
        OIDC["GitHub OIDC JWT\nIssued per workflow run\nExpires after job"]
        STS["AWS STS\nAssumeRoleWithWebIdentity\n15-min session tokens"]
        ROLE["IAM Deploy Role\nScoped to repo:\nRithicaa/rithi-vilas-arts-and-crafts\naud: sts.amazonaws.com"]
    end

    subgraph Policies["Least-Privilege IAM Policies"]
        P1["Deploy Policy\nS3 · ACM · Route53\nDynamoDB · IAM read-only"]
        P2["CloudFront Policy\nSplit due to 6144 char limit\nAll CF actions"]
    end

    subgraph BucketSecurity["S3 Security"]
        PAB["Public Access Block\nAll 4 settings enabled"]
        OAC["OAC Bucket Policy\ncloudfront.amazonaws.com only\nScoped to distribution ARN"]
        ENC["AES-256 Encryption\nServer-side · All objects"]
        VER["Versioning\nEnabled · Point-in-time recovery"]
    end

    subgraph EdgeSecurity["Edge Security — CloudFront"]
        TLS["TLS 1.2 minimum\nTLSv1.2_2021 policy"]
        HSTS["HSTS\nmax-age=31536000\nincludeSubDomains · preload"]
        CSP["Content Security Policy\ndefault-src 'self'"]
        XFO["X-Frame-Options: DENY"]
        XCTO["X-Content-Type-Options: nosniff"]
    end

    subgraph PipelineSecurity["Pipeline Security"]
        AUDIT["npm audit\nBlocks on high/critical CVEs"]
        GITLEAKS["Gitleaks\nSecrets scan every push"]
    end

    OIDC --> STS --> ROLE
    ROLE --> P1 & P2
    PAB & OAC & ENC & VER --> BucketSecurity
    TLS & HSTS & CSP & XFO & XCTO --> EdgeSecurity
    AUDIT & GITLEAKS --> PipelineSecurity
```

---

## 5. Terraform Infrastructure Modules

```mermaid
graph TD
    subgraph RootModule["Root Module — terraform/main.tf"]
        MAIN["main.tf\nWires all modules\nS3 bucket policy OAC"]
        VARS["variables.tf\naws_region · domain_name\nbucket_name · hosted_zone_id\ngithub_repo · tf_state_bucket"]
        OUT["outputs.tf\ncloudfront_url\ns3_bucket_name\nacm_certificate_arn\ngithub_actions_deploy_role_arn"]
    end

    subgraph Modules["terraform/modules/"]
        ACM["acm/\naws_acm_certificate\napex + www + wildcard SANs\naws_acm_certificate_validation\naws_route53_record validation\nProvider: us-east-1"]
        S3M["s3/\naws_s3_bucket\naws_s3_bucket_versioning\naws_s3_bucket_server_side_encryption\naws_s3_bucket_public_access_block"]
        CFM["cloudfront/\naws_cloudfront_distribution\naws_cloudfront_origin_access_control\naws_cloudfront_response_headers_policy"]
        R53M["route53/\naws_route53_record apex A alias\naws_route53_record www A alias"]
        IAMM["iam/\naws_iam_openid_connect_provider\naws_iam_role\naws_iam_policy × 2\naws_iam_role_policy_attachment × 2"]
    end

    subgraph Backend["Remote State"]
        STATE["S3 Backend\ns3://rithi-vilas-tf-state\nglobal/terraform.tfstate\nus-east-1"]
    end

    MAIN --> ACM & S3M & CFM & R53M & IAMM
    MAIN --> STATE
```

---

## 6. Cost Architecture

```mermaid
graph LR
    subgraph AlwaysFree["Always Free / Negligible"]
        ACM2["ACM\nFree with CloudFront"]
        GHA["GitHub Actions\nFree tier ~2000 min/month"]
        IAM2["IAM\nNo cost"]
    end

    subgraph LowCost["Low Cost"]
        CF2["CloudFront\nPriceClass_100\nUS · Canada · Europe only\n~$0.0085/10k requests"]
        S32["S3\nStorage + GET requests\n~$0.023/GB · $0.0004/1k GETs"]
        R532["Route 53\n~$0.50/month hosted zone\n$0.40/million queries"]
    end

    subgraph Optimisations["Cost Optimisations Applied"]
        PC["PriceClass_100\nNot global — reduces CF cost"]
        CACHE["Long cache TTLs\nmax-age=31536000 for assets\nReduces S3 origin requests"]
        NOCACHE["no-cache for index.html\nEnsures fresh deploys"]
    end
```

---

## 7. Disaster Recovery

| Scenario | Recovery Steps | RTO |
|---|---|---|
| Bad deploy (wrong assets in S3) | `aws s3 sync` previous build to S3 + CloudFront invalidation | < 5 min |
| Terraform state corruption | Restore from `rithi-vilas-tf-state` versioned state file | < 15 min |
| CloudFront distribution misconfigured | `terraform apply` to restore known-good config | < 10 min |
| ACM certificate expired | Auto-renews via DNS validation — no action needed | N/A |
| S3 object accidentally deleted | Restore from S3 versioning | < 5 min |
| Full infrastructure teardown | Re-run bootstrap steps + `terraform apply` | < 30 min |

---

## 8. Key AWS Resource Inventory

| Service | Resource | ID / ARN |
|---|---|---|
| Route 53 | Hosted Zone | `Z07156592IZG07FL53X90` |
| ACM | Certificate | `*.rithivilasartsandcrafts.org.uk` · us-east-1 |
| CloudFront | Distribution | `ESGCW04VAXWWD` |
| S3 | App Bucket | `rithi-vilas-arts-crafts-prod` |
| S3 | State Bucket | `rithi-vilas-tf-state` |
| IAM | OIDC Provider | `token.actions.githubusercontent.com` |
| IAM | Deploy Role | `arn:aws:iam::231921252815:role/rithi-vilas-arts-and-crafts-github-actions-deploy` |
| IAM | Deploy Policy | `rithi-vilas-arts-and-crafts-github-actions-deploy-policy` |
| IAM | CloudFront Policy | `rithi-vilas-arts-and-crafts-github-actions-cloudfront-policy` |
