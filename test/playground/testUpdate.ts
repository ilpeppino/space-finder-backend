import { handler } from '../../services/SpacesTable/Update'
import { APIGatewayProxyEvent } from 'aws-lambda'

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: "fa2bfda6-d912-4ea5-83d0-d0a3f9664b4d"
    }, 
    body: {
        location: "Den Haag"
    }
} as any

handler(event, {} as any)