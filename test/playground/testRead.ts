import { handler } from '../../services/SpacesTable/Read'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'

// Read per primary key (spaceId)

// const eventSpaceId: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         spaceId: "fa2bfda6-d912-4ea5-83d0-d0a3f9664b4d"
//     } 
//     // ,body: {
//     //     location: "Bari"
//     // }
// } as any

// handler(eventSpaceId as any, {} as any)

// -----------------------------------------------------------------------------

// Read per secondary key (location)

// const eventLocation: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         location: "Bari"
//     } 
//     // ,body: {
//     //     location: "Bari"
//     // }
// } as any

// handler(eventLocation as any, {} as any)

// -----------------------------------------------------------------------------

// Read all items

handler({} as APIGatewayProxyEvent, {} as Context)