import { Stack, StackProps, aws_lambda as lambda, aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkRestApiStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Defines an AWS Lambda resource
        const lambdaFunction = new lambda.Function(this, 'LambdaFunction', {
            runtime: lambda.Runtime.NODEJS_16_X, // Runtime version
            code: lambda.Code.fromAsset('lambda'), // Code loaded from the "lambda" directory
            handler: 'apiHandler.handler', // File is "apiHandler", function is "handler"
        });

        // Defines an API Gateway REST API resource backed by our "lambdaFunction" above.
        const api = new apigateway.RestApi(this, 'RestApi', {
            restApiName: 'CDK Rest API'
        });

        // Defines an API Gateway Lambda integration
        const getLambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction, {
            requestTemplates: { 'application/json': '{ "statusCode": 200 }' }
        });

        // Defines an API Gateway method for the root resource "/"
        api.root.addMethod('GET', getLambdaIntegration);
    }
}
