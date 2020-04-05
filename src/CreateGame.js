const Crypto = require('crypto');
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const randomGameId = Crypto.randomBytes(8).toString('hex').slice(0, 8);
    const params = {
        TableName: "Game", 
        Item: {
            PublicGameId: randomGameId
        }
    };
    
    await documentClient.put(params).promise();

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            gameId: randomGameId
        })
    };
    return response;
};
