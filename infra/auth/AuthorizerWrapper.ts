import { Construct } from 'constructs';
import { Authorizer, CognitoUserPoolsAuthorizer, RestApi } from 'aws-cdk-lib/aws-apigateway';
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
        this.createUser()
        this.addAuthorizer()

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

    private addUserPoolClient() {

        this.userPoolClient = this.userPool.addClient("SpaceUserPool-Client", {
            userPoolClientName: "SpaceUserPool-Client",
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            },
            generateSecret: false
        })

        new CfnOutput(this.scope, "UserPoolClientId", {
            value: this.userPoolClient.userPoolClientId
        })

    }

    private createUser() {

        this.userPoolClient

    }

    private addAuthorizer() {
        
        this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, "SpaceAuthorizer", {
            cognitoUserPools: [this.userPool],
            authorizerName: "SpaceAuthorizer",
            identitySource: 'method.request.header.Authorization'
        })

        this.authorizer._attachToApi(this.api)

    }



}