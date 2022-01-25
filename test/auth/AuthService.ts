import { Auth }             from 'aws-amplify'
import Amplify              from 'aws-amplify'
import { config }           from './config'
import { CognitoUser}       from '@aws-amplify/auth'
import * as AWS             from 'aws-sdk'
import { Credentials}       from 'aws-sdk/lib/credentials'
import { resolve } from 'path';
import { rejects } from 'assert'

// User pools vs identity pools
// https://dev.to/aws-builders/what-is-amazon-cognito-user-pool-and-how-does-it-differ-from-a-cognito-identity-pool-4b2

// USER POOL: 
// IDENTITY POOL: Identity pools provide AWS credentials to grant your users registered into User Pool access to other AWS services.

Amplify.configure({
    Auth:  {
        mandatorySignIn: false,
        region: config.REGION,
        userPoolId: config.USER_POOL_ID,
        userPoolWebClientId: config.APP_CLIENT_ID,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        identityPoolId: config.IDENTITY_POOL_ID
    }
})

export class AuthService {

    // Login with user defined in User Pool

    public async login (userName: string, password: string) {

        const user = await Auth.signIn(userName, password) as CognitoUser
        console.log(user)
        return user

    }

    public async getAWSTempCredentials(user: CognitoUser) {

        // Code sample taken from Identity pools on AWS console
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityCredentials.html

        // Amazon Cognito identity pools provide temporary AWS credentials for users who are guests (unauthenticated) and 
        // for users who have been authenticated and received a token. 
        // An identity pool is a store of user identity data specific to your account.

        const cognitoIdentityPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}` 

        // Get identity credentials to sign requests with, from the identity pool where Cognito credentials resides
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityCredentials.html#constructor-property
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.IDENTITY_POOL_ID,
            Logins: {
                // cognitoIdentutyPool needs to be provided as a key []
                [cognitoIdentityPool]: user.getSignInUserSession()!.getIdToken().getJwtToken()
            }
        }, {
            region: config.REGION
        })

        console.log(`JWT Token : ${user.getSignInUserSession()!.getIdToken().getJwtToken()}`)

        await this.refreshCredentials()

    }

    private async refreshCredentials(): Promise<void>{
        return new Promise((resolve, reject)=>{
            (AWS.config.credentials as Credentials).refresh(err =>{
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

}