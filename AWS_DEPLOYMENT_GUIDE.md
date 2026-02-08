# AWS Deployment Guide - Mandi AI

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Python 3.11 installed locally
- Basic understanding of AWS services

## Step-by-Step Deployment

### 1. Amazon Bedrock Setup

#### Enable Bedrock Access
1. Go to AWS Console → Amazon Bedrock
2. Select your region (us-east-1 recommended)
3. Navigate to "Model access"
4. Request access to:
   - **Anthropic Claude 3 Sonnet** (recommended)
   - **Amazon Titan Text Express** (alternative)
5. Wait for approval (usually instant for most accounts)

#### Test Bedrock Access
```bash
aws bedrock list-foundation-models --region us-east-1
```

### 2. IAM Role Configuration

#### Create Lambda Execution Role

1. Go to IAM Console → Roles → Create Role
2. Select "AWS Service" → "Lambda"
3. Attach policies:
   - `AWSLambdaBasicExecutionRole`
   - Create custom policy for Bedrock:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-express-v1"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

4. Name the role: `MandiAI-Lambda-Execution-Role`

### 3. Deploy Lambda Functions

#### Option A: AWS Console (Recommended for Beginners)

**Deploy Price Fetcher Lambda:**

1. Go to Lambda Console → Create Function
2. Configuration:
   - Name: `mandi-price-fetcher`
   - Runtime: Python 3.11
   - Architecture: x86_64
   - Execution role: Use existing role → `MandiAI-Lambda-Execution-Role`

3. Upload code:
   - Copy content from `lambda_price_fetcher.py`
   - Paste into inline code editor
   - Click "Deploy"

4. Configure:
   - Memory: 256 MB
   - Timeout: 10 seconds
   - Environment variables:
     - `API_KEY`: Your government API key (get from data.gov.in)

5. Add Layer (for requests library):
   - Go to Layers → Add a layer
   - Choose "AWS Layers" → `AWSSDKPandas-Python311` (includes requests)

**Deploy AI Advisor Lambda:**

1. Create Function:
   - Name: `mandi-ai-advisor`
   - Runtime: Python 3.11
   - Execution role: `MandiAI-Lambda-Execution-Role`

2. Upload code from `lambda_ai_advisor.py`

3. Configure:
   - Memory: 512 MB
   - Timeout: 30 seconds
   - Environment variables:
     - `AWS_REGION`: us-east-1

#### Option B: AWS CLI

**Package and Deploy:**

```bash
# Create deployment package for price fetcher
cd lambda_functions
pip install requests -t price_fetcher/
cp lambda_price_fetcher.py price_fetcher/
cd price_fetcher
zip -r ../price_fetcher.zip .
cd ..

# Deploy price fetcher
aws lambda create-function \
  --function-name mandi-price-fetcher \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/MandiAI-Lambda-Execution-Role \
  --handler lambda_price_fetcher.lambda_handler \
  --zip-file fileb://price_fetcher.zip \
  --timeout 10 \
  --memory-size 256

# Deploy AI advisor
aws lambda create-function \
  --function-name mandi-ai-advisor \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/MandiAI-Lambda-Execution-Role \
  --handler lambda_ai_advisor.lambda_handler \
  --zip-file fileb://lambda_ai_advisor.zip \
  --timeout 30 \
  --memory-size 512
```

### 4. API Gateway Setup

#### Create REST API

1. Go to API Gateway Console → Create API
2. Choose "REST API" (not private)
3. Name: `Mandi-AI-API`
4. Endpoint Type: Regional

#### Create Resources and Methods

**Resource 1: /prices/{crop}**

1. Actions → Create Resource
   - Resource Name: `prices`
   - Resource Path: `/prices`

2. Select `/prices` → Actions → Create Resource
   - Resource Name: `crop`
   - Resource Path: `{crop}`

3. Select `/{crop}` → Actions → Create Method → GET
   - Integration type: Lambda Function
   - Lambda Function: `mandi-price-fetcher`
   - Use Lambda Proxy integration: ✓

4. Method Request → URL Query String Parameters:
   - Add: `location` (not required)

**Resource 2: /ai-advice**

1. Actions → Create Resource
   - Resource Name: `ai-advice`
   - Resource Path: `/ai-advice`

2. Select `/ai-advice` → Actions → Create Method → POST
   - Integration type: Lambda Function
   - Lambda Function: `mandi-ai-advisor`
   - Use Lambda Proxy integration: ✓

#### Enable CORS

For each resource:
1. Select resource → Actions → Enable CORS
2. Configure:
   - Access-Control-Allow-Origin: `*`
   - Access-Control-Allow-Headers: `Content-Type,X-Amz-Date,Authorization,X-Api-Key`
   - Access-Control-Allow-Methods: `GET,POST,OPTIONS`

#### Deploy API

1. Actions → Deploy API
2. Deployment stage: `prod`
3. Note the Invoke URL: `https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod`

### 5. Test Lambda Functions

#### Test Price Fetcher

```bash
aws lambda invoke \
  --function-name mandi-price-fetcher \
  --payload '{"pathParameters":{"crop":"wheat"},"queryStringParameters":{"location":"delhi"}}' \
  response.json

cat response.json
```

#### Test AI Advisor

```bash
aws lambda invoke \
  --function-name mandi-ai-advisor \
  --payload '{"body":"{\"query\":\"What is the best time to plant wheat?\",\"language\":\"hi\"}"}' \
  response.json

cat response.json
```

### 6. Update Frontend Configuration

Edit `script.js`:

```javascript
const API_CONFIG = {
    baseUrl: 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod',
    endpoints: {
        prices: '/prices',
        aiAdvice: '/ai-advice'
    }
};
```

### 7. Deploy Frontend

#### Option A: GitHub Pages

1. Go to repository settings
2. Pages → Source: Deploy from branch
3. Branch: main, folder: / (root)
4. Save
5. Access at: `https://anujpaswan24.github.io/Mandi-AI-Bharath/`

#### Option B: AWS S3 + CloudFront

```bash
# Create S3 bucket
aws s3 mb s3://mandi-ai-frontend

# Upload files
aws s3 sync . s3://mandi-ai-frontend --exclude ".git/*"

# Enable static website hosting
aws s3 website s3://mandi-ai-frontend --index-document index.html

# Make bucket public
aws s3api put-bucket-policy --bucket mandi-ai-frontend --policy file://bucket-policy.json
```

### 8. Monitoring and Logging

#### CloudWatch Logs

1. Go to CloudWatch → Log groups
2. Find:
   - `/aws/lambda/mandi-price-fetcher`
   - `/aws/lambda/mandi-ai-advisor`

#### Set Up Alarms

```bash
# Create alarm for Lambda errors
aws cloudwatch put-metric-alarm \
  --alarm-name mandi-lambda-errors \
  --alarm-description "Alert on Lambda errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

## Cost Estimation

### Free Tier (First 12 Months)
- Lambda: 1M requests/month free
- API Gateway: 1M requests/month free
- CloudWatch: 10 custom metrics free

### Beyond Free Tier (Monthly)
- **Lambda**: ~$5 (compute time)
- **API Gateway**: ~$3.50 (1M requests)
- **Amazon Bedrock**: ~$20 (foundation model usage)
- **CloudWatch**: ~$2 (logs and metrics)
- **Total**: ~$30.50/month

### Cost Optimization Tips
1. Enable Lambda function caching
2. Set appropriate timeout values
3. Use CloudWatch Logs Insights sparingly
4. Implement API Gateway caching (30 min TTL)
5. Monitor Bedrock token usage

## Troubleshooting

### Lambda Function Errors

**Error: "Unable to import module"**
- Solution: Ensure all dependencies are included in deployment package
- For requests library, add AWS Lambda Layer

**Error: "Task timed out"**
- Solution: Increase timeout in Lambda configuration
- Check external API response times

### Bedrock Access Issues

**Error: "AccessDeniedException"**
- Solution: Verify IAM role has `bedrock:InvokeModel` permission
- Check model access is enabled in Bedrock console

**Error: "ModelNotReadyException"**
- Solution: Wait for model access approval
- Try alternative model (Titan instead of Claude)

### API Gateway Issues

**Error: "Missing Authentication Token"**
- Solution: Check API endpoint URL is correct
- Verify API is deployed to correct stage

**CORS Errors**
- Solution: Enable CORS on all resources
- Add OPTIONS method for preflight requests

## Security Best Practices

1. **API Keys**: Use API Gateway API keys for production
2. **Rate Limiting**: Configure throttling (1000 req/sec)
3. **Secrets**: Store API keys in AWS Secrets Manager
4. **Monitoring**: Enable CloudTrail for audit logs
5. **Encryption**: Use HTTPS/TLS 1.3 for all communications

## Next Steps

1. **Custom Domain**: Set up custom domain with Route 53
2. **CDN**: Add CloudFront for global distribution
3. **Authentication**: Implement Cognito for user management
4. **Database**: Add DynamoDB for user preferences
5. **Analytics**: Integrate with AWS Analytics services

## Support

For issues or questions:
- GitHub Issues: [Mandi-AI-Bharath/issues](https://github.com/AnujPaswan24/Mandi-AI-Bharath/issues)
- AWS Documentation: [docs.aws.amazon.com](https://docs.aws.amazon.com)

---

**Happy Deploying! 🚀**
