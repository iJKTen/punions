const Crypto = require('crypto');
const AWS = require("aws-sdk");

// Initialising the DynamoDB SDK
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const randomGameId = Crypto.randomBytes(8).toString('base64').slice(0, 8);
    const params = {
        TableName: "Game", // The name of your DynamoDB table
        Item: { // Creating an Item with a unique id and with the passed title
            PublicGameId: randomGameId
        }
    };
    const data = await documentClient.put(params).promise();
    const response = {
        statusCode: 200,
        body: JSON.stringify(randomGameId),
    };
    return response;
};
