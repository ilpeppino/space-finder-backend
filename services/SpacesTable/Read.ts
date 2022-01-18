import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { v4 } from 'uuid'

export { handler }

// Passed by GenericTable as part of the environment properties of CreateSingleLambda method
const TABLE_NAME = process.env.TABLE_NAME
const PRIMARY_KEY = process.env.PRIMARY_KEY

// Creates db client
const dbClient = new DynamoDB.DocumentClient()

// This handler allows to call lambdas via API GW, keep an eye on the input parameters type
async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DynamoDb'
    }

    try {
        if (event.queryStringParameters && (PRIMARY_KEY! in event.queryStringParameters)) {
            
            const queryResponse = await dbClient.query({
                TableName: TABLE_NAME!,
                KeyConditionExpression: '#primaryKeyName = :primaryKeyValue',
                ExpressionAttributeNames: {"#primaryKeyName": PRIMARY_KEY!},
                ExpressionAttributeValues: {":primaryKeyValue": event.queryStringParameters[PRIMARY_KEY!]}
            }).promise()

            result.body = JSON.stringify(queryResponse)
        }
            
        
        else {
            const queryResponse = await dbClient.scan({TableName:TABLE_NAME!}).promise()
            result.body = JSON.stringify(queryResponse)
        }

    }
    catch (error) {
        result.body = error.message
    }

    return result

}

