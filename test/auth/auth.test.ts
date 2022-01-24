import {AuthService} from './AuthService'
import {config} from './config'
import { CognitoUser } from '@aws-amplify/auth';

const authService = new AuthService()

const user  = authService.login(config.USERNAME, config.PASSWORD)

console.log(`User ${config.USERNAME} logged in`)
console.log("-----------")
console.log(`TOKEN: ${user}`)