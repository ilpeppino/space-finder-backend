import {AuthService} from './AuthService'
import {config} from './config'

const authService = new AuthService()

const user = authService.login(config.USERNAME, config.PASSWORD)