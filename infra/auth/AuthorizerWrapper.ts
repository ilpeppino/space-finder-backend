import { Construct } from 'constructs';
import { CognitoUserPoolsAuthorizer, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { CfnOutput } from 'aws-cdk-lib';







export class AuthorizerWrapper {

    private scope: Construct
    private api: RestApi
    private userPool: UserPool
    private userPoolClient: UserPoolClient
    public  authorizer: CognitoUserPoolsAuthorizer


    constructor(scope: Construct, api: RestApi) {

        this.scope = scope
        this.api = api
        this.initialize()
    }

    private initialize() {

        this.createUserPool()
        this.addUserPoolClient()

    }
    addUserPoolClient() {

        this.userPoolClient = new UserPoolClient(this.scope, "SpaceUserPoolClient", {
            userPool : this.userPool,
            userPoolClientName: "SpaceUserPoolClient"
        })

    }

    private createUserPool() {

        
        this.userPool = new UserPool(this.scope, "AuthorizerSpaceUserPools", {
            userPoolName: "SpaceUserPool",
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        })

        new CfnOutput(this.scope, "UserPoolId", {
            value: this.userPool.userPoolId 
        })

    }

}