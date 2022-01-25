import {AuthService} from './AuthService'
import {config} from './config'
import { CognitoUser } from '@aws-amplify/auth';
import * as AWS from 'aws-sdk'


async function callLogin() {
    
    const authService = new AuthService()

    const user  = await authService.login(config.USERNAME, config.PASSWORD)
    await authService.getAWSTempCredentials(user)
    
    const credentials = AWS.config.credentials

    console.log(`User ${config.USERNAME} logged in`)

}

callLogin()


