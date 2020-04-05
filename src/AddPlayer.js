const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    let canGameBegin = false;
    let playing = false;
    
    const {
        pathParameters: { publicGameId }
    } = event; // Extracting an id from the request path
    
    const { playerId } = JSON.parse(event.body);
    
    const params = {
        TableName: "Game",
        Key: { 
            "PublicGameId": publicGameId
        }
    }
    
    const data = await documentClient.get(params).promise();
    
    if(!data.Item["players"]) {
        data.Item["players"] = [];
        playing = true;
    }
    else {
        canGameBegin = true;
    }
    
    if(data.Item.players.find(player => player.playerId === playerId) === undefined) {
        data.Item.players.push({ "playerId": playerId, "playing": playing });
    }
    
    let player = data.Item.players.find(player => player.playerId === playerId);
    player["playerOrder"] = data.Item.players.length;
    
    const paramss = {
        TableName: "Game",
        Item: data.Item
    }
    
    const data2 = await documentClient.put(paramss).promise();
    
    var lambda = new AWS.Lambda({
        region: 'ap-northeast-1' //change to your region
    });
    
    const dataToSend = {
            playerIds: data.Item.players,
            publicGameId: publicGameId  
    }

    lambda.invoke({
            FunctionName: 'TestCallFromAnotherLambda',
            Payload: JSON.stringify(dataToSend)
        }, function(error, data) {
            if (error) {
                console.log('error', error);
            }
            if(data.Payload){
                console.log(data.Payload);
            }
    });
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(canGameBegin)
    };
    return response;
};
