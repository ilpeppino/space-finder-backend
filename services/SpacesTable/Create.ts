import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
//import { v4 } from 'uuid'
import { randomizer, getEventBody } from '../shared/Utils';
import { MissingFieldError, validateSpaceEntry } from '../shared/InputValidator';


// Passed by GenericTable as part of the environment properties of CreateSingleLambda method
const TABLE_NAME = process.env.TABLE_NAME

// Creates db client
const dbClient = new DynamoDB.DocumentClient()

// This handler allows to call lambdas via API GW, keep an eye on the input parameters type
async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {



        // Creates the item to put in the db from the body of the event received by the handler
        const item = getEventBody(event)

        // Needed because spaceId is primaryKey
        item.spaceId = randomizer()
        console.log(item.spaceId)
        //validateSpaceEntry(item)

        const result: APIGatewayProxyResult = {
            statusCode: 200,
            body: `Table ${TABLE_NAME} - SpaceId: ${item.spaceId} - Event body: ${getEventBody(event)}`
        }


    try {



        console.log(`Adding SpaceId ${item.spaceId}`)

        await dbClient.put({
            TableName: TABLE_NAME!, // the exclamation says that for sure we will have this variable set, because part of the table constructor
            Item: item
        })
        .promise()

        console.log(`Added SpaceId ${item.spaceId}`)

        result.body = JSON.stringify(`Created item with id: ${item.spaceId}`)

    } 
    
    catch (error) {

        // if (error instanceof MissingFieldError) {
        //     result.statusCode = 403
        // }

        // else {
        //     result.statusCode = 500
        // }
        
        result.body = error.message
        console.log(error)

    }
    
    

    return result

}

export { handler }