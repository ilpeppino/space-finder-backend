//import { handler } from '../../services/node-lambda/hello'
import {handler} from '../../services/SpacesTable/Create'
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

handler({} as APIGatewayProxyEvent, {} as Context )