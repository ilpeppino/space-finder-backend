import { Auth }             from 'aws-amplify'
import Amplify              from 'aws-amplify'
import { config }           from './config'
import { CognitoUser}       from '@aws-amplify/auth'
import * as AWS             from 'aws-sdk'
import { Credentials}       from 'aws-sdk/lib/credentials'
import { resolve } from 'path';
import { rejects } from 'assert'

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

    public async login (userName: string, password: string) {

        const user = await Auth.signIn(userName, password) as CognitoUser
        console.log(user)
        return user

    }

    public async getAWSTempCredentials(user: CognitoUser) {

        // Code sample taken from Identity pools on AWS console
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityCredentials.html

        const cognitoIdentityPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}`

        // Get identity credentials to sign requests with, from the identity pool where Cognito credentials resides
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityCredentials.html#constructor-property
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.IDENTITY_POOL_ID,
            Logins: {
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