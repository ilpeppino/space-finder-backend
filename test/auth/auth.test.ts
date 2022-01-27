import {AuthService} from './AuthService'
import {config} from './config'
import { CognitoUser } from '@aws-amplify/auth';
import * as AWS from 'aws-sdk'


AWS.config.region = "us-east-1"

async function getBuckets() {
    let buckets
    try {
        buckets = await new AWS.S3().listBuckets().promise()
    } 
    
    catch (error) {
        buckets = undefined
    }

    return buckets
}

async function callLogin() {
    
    const authService = new AuthService()

    const user  = await authService.login(config.USERNAME, config.PASSWORD)
    await authService.getAWSTempCredentials(user)
    
    const credentials = AWS.config.credentials

    const buckets = await getBuckets()

    console.log(`User ${config.USERNAME} logged in`)

}

callLogin()


