const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    const params = {
        TableName: "Card"
    }
    
    const data = await documentClient.scan(params).promise();
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(data.Items),
    };
    return response;
};
