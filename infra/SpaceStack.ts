import { Stack, StackProps, App }                       from 'aws-cdk-lib';
import { Construct }                                    from 'constructs';
import { Code, Function as LambdaFunction, Runtime }    from 'aws-cdk-lib/aws-lambda'
import { join }                                         from 'path'
import { LambdaIntegration, RestApi }                   from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from './GenericTable';

export class SpaceStack extends Stack {
    
    private api = new RestApi(this, 'SpaceApi')
    private spacesTable = new GenericTable(
        'SpacesTable',
        'spaceId',
        this
    )

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope,id,props)

        const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        })

        // Hello API Lambda integration
        
        // Integrates an AWS Lambda function to an API Gateway method
        const helloLambdaIntegration = new LambdaIntegration(helloLambda)

        // Adds reource to the API gateway, accessible on URI /hello
        const helloLambdaResource = this.api.root.addResource('hello')

        // Adds method that calls the API
        helloLambdaResource.addMethod('GET', helloLambdaIntegration)

        // Once deployed, copy the output, and /hello and go to raw data to see if the response is correct
    }
}