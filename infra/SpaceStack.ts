import { Stack, StackProps }                       from 'aws-cdk-lib';
import { Construct }                                    from 'constructs';
import { Code, Function as LambdaFunction, Runtime }    from 'aws-cdk-lib/aws-lambda'
import { join }                                         from 'path'
import { LambdaIntegration, RestApi }                   from 'aws-cdk-lib/aws-apigateway'
import { GenericTable }                                 from './GenericTable'
// Class 25. Import needed for Lamba bundling
import { NodejsFunction}                                from 'aws-cdk-lib/aws-lambda-nodejs'

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


//------------------------------------------------------------------------------------
        // CASE 1
        // Lambda integration with LambdaFunction with Javascript class
        
        // Integrates an AWS Lambda function to an API Gateway method
        const helloLambdaIntegration = new LambdaIntegration(helloLambda)

        // Adds reource to the API gateway, accessible on URI /hello
        const helloLambdaResource = this.api.root.addResource('hello')

        // Adds method that calls the API
        helloLambdaResource.addMethod('GET', helloLambdaIntegration)

        // Once deployed, copy the output, and /hello and go to raw data to see if the response is correct

//------------------------------------------------------------------------------------

        // CASE 2
        // Lambda integration with NodejsFunction with Typescript class

        const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
            entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
            handler: 'handler'
        })

//------------------------------------------------------------------------------------

        // CASE 3
        // Lambda integration with webpack

        // code must point to the bundle
        // handler is the handler defined in the hello.ts

        const helloLambdaWebpack = new LambdaFunction(this, 'helloLambdaWebpack', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'build', 'nodeHelloLambda')),
            handler: 'nodeHelloLambda.handler'
        })
    }
}