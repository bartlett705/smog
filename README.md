# AWS CDK HTTP Form Backend

Deploys the following resources and connections/permissions to serve as a basic endpoint for receiveing old-school form POST actions triggered by html form elements. Can be easily modified to work with more modern async JSON POST requests.

Super quickstart:

```bash
npm i
npm run build
npx cdk deploy
```

### Resources deployed to your configured account by running `cdk deploy`

- [x] Lambda -> Discord
- [x] Lambda -> Dynamo
- [x] API Gateway -> Lambda
- [x] DynamoDB table

### Todo

- [ ] Add ACM cert provisioning and/or route 53 DNS entire for for custom domains
