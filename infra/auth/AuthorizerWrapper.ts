import { Construct }                from 'constructs';
import { 
    Authorizer, 
    CognitoUserPoolsAuthorizer, 
    RestApi }                       from 'aws-cdk-lib/aws-apigateway';
import { 
    UserPool, 
    UserPoolClient, 
    VerificationEmailStyle, 
    CfnUserPoolGroup }              from 'aws-cdk-lib/aws-cognito';
import { CfnOutput }                from 'aws-cdk-lib';
import { IdentityPoolWrapper } from './IdentityPoolWrapper';



export class AuthorizerWrapper {

    private scope           : Construct
    private api             : RestApi
    private userPool        : UserPool
    private userPoolClient  : UserPoolClient
    public  authorizer      : CognitoUserPoolsAuthorizer
    private identityPool    : IdentityPoolWrapper


    constructor(scope: Construct, api: RestApi) {

        this.scope = scope
        this.api = api
        this.initialize()
    }

    private initialize() {

        this.createUserPool()
        this.addUserPoolClient()
        this.addAuthorizer()
        this.initializeIdentityPoolWrapper()
        this.createAdminGroup()
    }

    private createUserPool() {

        
        this.userPool = new UserPool(this.scope, "SpaceUserPool", {
            userPoolName: "SpaceUserPool",
            selfSignUpEnabled: true,
            signInAliases: {
                username    : true,
                email       : true
            },
            autoVerify: {
                email       : true
            },
            userVerification: {
                emailSubject    : "User registration to Space finder",
                emailBody       : `Thanks for signing up to our awesome app! Your verification code is {####}`,
                emailStyle      : VerificationEmailStyle.CODE
            },
            userInvitation: {
                emailSubject    : "User invitation to Space finder",
                emailBody       : `Hello {username}! You have been invited as user in Cognito. Your temporary password is {####}`
            },
            passwordPolicy: {
                minLength           : 8,
                requireDigits       : false,
                requireLowercase    : false,
                requireSymbols      : false,
                requireUppercase    : false,
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


    private addAuthorizer() {
        
        this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, "SpaceAuthorizer", {
            cognitoUserPools: [this.userPool],
            authorizerName: "SpaceAuthorizer",
            identitySource: 'method.request.header.Authorization'
        })

        this.authorizer._attachToApi(this.api)

    }

    private createAdminGroup() {

        new CfnUserPoolGroup(this.scope, "Admin", {
            userPoolId: this.userPool.userPoolId,
            groupName: "Admin",
            roleArn: this.identityPool.adminRole.roleArn
        })

    }

    private initializeIdentityPoolWrapper() {
        this.identityPool =  new IdentityPoolWrapper(this.scope, this.userPool, this.userPoolClient)
    }



}