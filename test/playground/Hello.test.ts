import {handler} from '../../services/SpacesTable/Create'
//import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

const event = {
    body: {
        location: 'Paris' 
    }
}

// handler(event as any, {} as Context )
handler(event as any, {} as any)