import { handler } from '../../services/SpacesTable/Create'
import { APIGatewayProxyEvent } from 'aws-lambda'

// Creates a new item (spaceId is automatically generated)

// const event = {
//     body: {
//         location: 'Paris' 
//     }
// }


// handler(event as any, {} as any)

//---------------------------------------------------------------------

// Try error messages

const event : APIGatewayProxyEvent = {
    body: {
        name: "dummy",
        location : "dummy location"
    }
} as any

handler(event, {} as any)