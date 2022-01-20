// import { DynamoDB } from 'aws-sdk'
// import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda'
// import { v4 } from 'uuid'

// export { handler }

// // Passed by GenericTable as part of the environment properties of CreateSingleLambda method
// const TABLE_NAME = process.env.TABLE_NAME as string
// const PRIMARY_KEY = process.env.PRIMARY_KEY as string

// // Creates db client
// const dbClient = new DynamoDB.DocumentClient()


// // This handler allows to call lambdas via API GW, keep an eye on the input parameters type
// async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

//     const result: APIGatewayProxyResult = {
//         statusCode: 200,
//         body: 'Hello from DYnamoDb'
//     }

//     const spaceId = event.queryStringParameters?.[PRIMARY_KEY]
//     try {
//         if (spaceId) {
//             console.log(`Deleting spaceId ${spaceId}`)
//             const deleteResult = await dbClient.delete({
//                 TableName: TABLE_NAME,
//                 Key: {
//                     PRIMARY_KEY: spaceId
//                 }})
//                 .promise()
//             console.log(`Deleted spaceId ${spaceId}`)
//             result.body = JSON.stringify(deleteResult)
//         }
//     }

//     catch (error) {
//         result.body = error.message
//         console.log(error)
//     }

//     return result
// }



import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';



const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    }

    const spaceId = event.queryStringParameters?.[PRIMARY_KEY]

    if (spaceId) {
        const deleteResult = await dbClient.delete({
            TableName: TABLE_NAME,
            Key:{
                [PRIMARY_KEY]: spaceId
            }
        }).promise();
        result.body = JSON.stringify(deleteResult);
    }

    return result
}

export { handler }