import apiGateway = require('@aws-cdk/aws-apigateway')
import dynamo = require('@aws-cdk/aws-dynamodb')
import { AttributeType } from '@aws-cdk/aws-dynamodb'
import lambda = require('@aws-cdk/aws-lambda')
import * as cdk from '@aws-cdk/core'
import path = require('path')
// You must provide this file yourself! The channel ID is the first part of the webhook URL,
// the 'token', is the second, longer component
import config = require('../config.json')

const { CHANNEL_ID, DISCORD_TOKEN, INSTANCE_NAME } = config

const addIdentifier = (nameComponent: string) =>
  `${nameComponent}-${INSTANCE_NAME}`
/**
 *  Lambda + Dyanmo table stack suitable for receving html form action-triggered
 *  POST requests with urlencoded parameters. Also pings discord
 *
 */
export default class SmogStack extends cdk.Stack {
  public table = new dynamo.Table(this, addIdentifier('AutoSmogStore'), {
    // Throwaway partition key for very basic use cases that is always set to the same value in the lambda.
    // If this is meant for high traffic, pick something more suitable!
    partitionKey: { type: AttributeType.STRING, name: 'hash' },
    sortKey: { type: AttributeType.NUMBER, name: 'createdAt' }
  })

  /** Form POST endpoint handler */
  public lambda = new lambda.Function(this, addIdentifier('AutoSmogFunction'), {
    runtime: lambda.Runtime.NODEJS_12_X,
    code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/build')),
    handler: 'index.handler',
    environment: {
      TABLE_NAME: this.table.tableName,
      CHANNEL_ID,
      DISCORD_TOKEN,
      INSTANCE_NAME
    }
  })

  /** Enitity that represents our endpoint(s) within the APIGateway service */
  public api = new apiGateway.RestApi(this, addIdentifier('AutoSmogAPI'), {
    restApiName: addIdentifier('Auto Smog Service for '),
    description: 'CDK-powered form POST handler.'
  })

  /**
   * Exposes the lambda on the public internet via APIGateway
   * with a very basic request template
   */
  public postIntegration = new apiGateway.LambdaIntegration(this.lambda, {
    requestTemplates: { 'application/json': '{ "statusCode": "200" }' }
  })

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.api.root.addMethod('POST', this.postIntegration)
    this.table.grantWriteData(this.lambda)

    // tslint:disable: no-unused-expression
    // constructors w/ side effects is just how CDK works 🤷‍♂
    new cdk.CfnOutput(this, 'TableName', { value: this.table.tableName })
    new cdk.CfnOutput(this, 'FunctionName', {
      value: this.lambda.functionName
    })
  }
}
