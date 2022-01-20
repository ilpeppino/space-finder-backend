import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda'
import { v4 } from 'uuid'

export { handler }

// Passed by GenericTable as part of the environment properties of CreateSingleLambda method
const TABLE_NAME = process.env.TABLE_NAME as string
const PRIMARY_KEY = process.env.PRIMARY_KEY as string

// Creates db client
const dbClient = new DynamoDB.DocumentClient()


// This handler allows to call lambdas via API GW, keep an eye on the input parameters type
async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    }


    // In the event body there is the item that needs to be updated (see test file with PUT call)
    const requestBody = typeof event.body == 'object'? event.body: JSON.parse(event.body)

    // This would give an error
    //const spaceId = event.queryStringParameters[PRIMARY_KEY]

    // To avoid this, we can add ? to say to return the value if it exists
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY]



    // If URL contains query string parameters (primary or secondary key)
    // Example URL: https://ar10dtwcme.execute-api.us-east-1.amazonaws.com/prod/spaces?spaceId=fd083169-26b4-482a-8b14-fdbe3e6f0588
    
    // This a way to get keys and values from untyped Object, in this case requestBody

    const itemToUpdateKey = Object.keys(requestBody)[0]
    const itemToUpdateValue = requestBody[itemToUpdateKey]

    const updateResult = dbClient.update({
        TableName: TABLE_NAME,
        Key: {
            PRIMARY_KEY: spaceId
        },
        UpdateExpression: "SET #itemName = :itemValue",
        ExpressionAttributeNames:  { "#itemname" : itemToUpdateKey},
        ExpressionAttributeValues: { ":itemValue" : itemToUpdateValue},
        ReturnValues: "UPDATED_NEW"
    }).promise()

    result.body = JSON.stringify(updateResult)

    return result
}



