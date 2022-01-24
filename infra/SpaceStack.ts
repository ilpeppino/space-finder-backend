import { Stack, StackProps }                       from 'aws-cdk-lib';
import { Construct }                                    from 'constructs';
import { Code, Function as LambdaFunction, Runtime }    from 'aws-cdk-lib/aws-lambda'
import { join }                                         from 'path'
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi }                   from 'aws-cdk-lib/aws-apigateway'
import { GenericTable }                                 from './GenericTable'
// Class 25. Import needed for Lamba bundling
import { NodejsFunction}                                from 'aws-cdk-lib/aws-lambda-nodejs'
import { PolicyStatement }                              from 'aws-cdk-lib/aws-iam'
import { AuthorizerWrapper }                            from './auth/AuthorizerWrapper'
import { UserPool } from 'aws-cdk-lib/aws-cognito';

export class SpaceStack extends Stack {
    
    // Defines API gateway REST (aws-apigateway)
    private _api = new RestApi(this, 'SpaceApi')

    private _authorizationWrapper : AuthorizerWrapper 

    // Defines Dynamo db table (GenericTable.ts). This calls the constructor of GenericTable
    private _spacesTable = new GenericTable(this, {

        tableName:          'SpacesTable',
        primaryKey:         'spaceId',
        createLambdaPath:   'Create',
        readLambdaPath:     'Read',
        updateLambdaPath:   'Update',
        deleteLambdaPath:   'Delete',
        secondaryIndexes:   ["location"]

    })


    // Stack constructor
    constructor(scope: Construct, id: string, props:StackProps) {
        super(scope,id,props)

        this._authorizationWrapper = new AuthorizerWrapper(this, this._api)


        //------------------------------------------------------------------------------------
        // CASE 1
        // Lambda integration with LambdaFunction with Javascript class

        // const helloLambda = new LambdaFunction(this, 'helloLambda', {
        //     runtime: Runtime.NODEJS_14_X,
        //     code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
        //     handler: 'hello.main'
        // })

        
        // // Integrates an AWS Lambda function to an API Gateway method
        // const helloLambdaIntegration = new LambdaIntegration(helloLambda)

        // // Adds reource to the API gateway, accessible on URI /hello
        // const helloLambdaResource = this.api.root.addResource('hello')

        // // Adds method that calls the API
        // helloLambdaResource.addMethod('GET', helloLambdaIntegration)

        // Once deployed, copy the output, and /hello and go to raw data to see if the response is correct

//------------------------------------------------------------------------------------

        // CASE 2
        // Lambda integration with NodejsFunction with Typescript class

        // const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
        //     entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
        //     handler: 'handler'
        // })

        // Create and attach policy to Lambda so that it can list all the buckets
        // const s3ListPolicy = new PolicyStatement()
        // s3ListPolicy.addActions('s3:ListAllMyBuckets')
        // s3ListPolicy.addResources('*')
        // helloLambdaNodeJs.addToRolePolicy(s3ListPolicy)


        // Configures the API gateway to access the lambda
        // const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs)
        // const helloLambdaResource = this.api.root.addResource('hello')
        // helloLambdaResource.addMethod('GET', helloLambdaIntegration)

        // Spaces API Integration

        // Adds resource to API gateway with URI /spaces
        const spaceResource = this._api.root.addResource('spaces')

        const optionsWithAuthorizer: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this._authorizationWrapper.authorizer.authorizerId
            }
        }

        // Adds method to call createLambdaIntegration method in GenericTable
        spaceResource.addMethod('POST',     this._spacesTable.createLambdaIntegration)
        spaceResource.addMethod('GET',      this._spacesTable.readLambdaIntegration,    optionsWithAuthorizer)
        spaceResource.addMethod('PUT',      this._spacesTable.updateLambdaIntegration)
        spaceResource.addMethod('DELETE',   this._spacesTable.deleteLambdaIntegration)

          

//------------------------------------------------------------------------------------

        // CASE 3
        // Lambda integration with webpack

        // code must point to the bundle
        // handler is the handler defined in the hello.ts

        // const helloLambdaWebpack = new LambdaFunction(this, 'helloLambdaWebpack', {
        //     runtime: Runtime.NODEJS_14_X,
        //     code: Code.fromAsset(join(__dirname, '..', 'build', 'nodeHelloLambda')),
        //     handler: 'nodeHelloLambda.handler'
        // })
    }
}