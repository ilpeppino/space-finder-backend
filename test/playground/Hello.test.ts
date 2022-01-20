import { APIGatewayProxyEvent } from 'aws-lambda'
import { handler } from '../../services/SpacesTable/Update'
//import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

// const event = {
//     body: {
//         location: 'Paris' 
//     }
// }

// const event: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         spaceId: "fd083169-26b4-482a-8b14-fdbe3e6f0588"
//     }
// } as any

// // handler(event as any, {} as Context )
// handler(event, {} as any)

// const result = await handler({} as any, {} as any).then((apiResult)=>{
//     const items = JSON.parse(apiResult.body)
//     console.log("-------")
// })

// const event: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         spaceId: "fd083169-26b4-482a-8b14-fdbe3e6f0588"
//     }, 
//     body: {
//         location: "Bari"
//     }
// } as any

// // handler(event as any, {} as Context )
// handler(event, {} as any)

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: "fd083169-26b4-482a-8b14-fdbe3e6f0588"
    }
} as any

// handler(event as any, {} as Context )
handler(event, {} as any)