import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda'
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

        // Example URL: https://ar10dtwcme.execute-api.us-east-1.amazonaws.com/prod/spaces?spaceId=fd083169-26b4-482a-8b14-fdbe3e6f0588
        if (event.queryStringParameters) {
            if (PRIMARY_KEY! in event.queryStringParameters) {
                result.body = await queryTableByPrimaryKey(event.queryStringParameters)
            } else {
                result.body = await queryTableBySecondaryKey(event.queryStringParameters) 
            }
        }      
                
        else {
            result.body = await scanTable()
        }

    }
    catch (error) {
        result.body = error.message
    }

    return result

}

async function queryTableByPrimaryKey(queryParams: APIGatewayProxyEventQueryStringParameters) {

    const queryDbByPrimaryKey = await dbClient.query({
        TableName: TABLE_NAME!,
        // The KeyConditionExpression is written like this below with #<<keyname>> = :<<keyvalue>>
        KeyConditionExpression: '#primaryKeyName = :primaryKeyValue',
        ExpressionAttributeNames: { "#primaryKeyName": PRIMARY_KEY! },
        ExpressionAttributeValues: { ":primaryKeyValue": queryParams[PRIMARY_KEY!] }
    }).promise()

    return JSON.stringify(queryDbByPrimaryKey)

}

async function queryTableBySecondaryKey(queryParams:APIGatewayProxyEventQueryStringParameters) {
    const querySecondaryKey = Object.keys(queryParams)[0]
    const querySecondaryValue = queryParams[querySecondaryKey]
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        IndexName: querySecondaryKey,
        // The KeyConditionExpression is written like this below with #<<keyname>> = :<<keyvalue>>
        KeyConditionExpression: '#querySecondaryKey = :querySecondaryValue',
        ExpressionAttributeNames: { "#querySecondaryKey": querySecondaryKey },
        ExpressionAttributeValues: { ":querySecondaryValue": querySecondaryValue }
    }).promise()

    return JSON.stringify(queryResponse.Items)
}

async function scanTable():Promise<string> {

    const queryResponse = await dbClient.scan({TableName:TABLE_NAME!}).promise()
    return JSON.stringify(queryResponse.Items)

}
