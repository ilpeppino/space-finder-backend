import {AuthService} from './AuthService'
import {config} from './config'

const authService = new AuthService()

const user = authService.login(config.USERNAME, config.PASSWORD)

console.log(`User ${config.USERNAME} logged in`)