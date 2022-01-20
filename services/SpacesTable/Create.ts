import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { v4 } from 'uuid'


// Passed by GenericTable as part of the environment properties of CreateSingleLambda method
const TABLE_NAME = process.env.TABLE_NAME

// Creates db client
const dbClient = new DynamoDB.DocumentClient()

// This handler allows to call lambdas via API GW, keep an eye on the input parameters type
async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DynamoDb'
    }

    // Creates the item to put in the db from the body of the event received by the handler
    const item = typeof event.body == 'object'? event.body: JSON.parse(event.body)
    // Needed because spaceId is primaryKey
    item.spaceId = v4()

    try {
        console.log(`Adding SpaceId ${item.spaceId}`)
        await dbClient.put({
            TableName: TABLE_NAME!, // the exclamation says that for sure we will have this variable set, because part of the table constructor
            Item: item
        }).promise()
        console.log(`Added SpaceId ${item.spaceId}`)
    } catch (error) {
        result.body = error.message
        console.log(error)
    }
    
    result.body = JSON.stringify(`Created item with id: ${item.spaceId}`)

    return result

}

export { handler }