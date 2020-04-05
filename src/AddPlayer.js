const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let canGameBegin = false;
    let playing = false;
    
    const {
        pathParameters: { gameid }
    } = event;
    
    const { playerId } = event;
    
    const params = {
        TableName: "Game",
        Key: { 
            "PublicGameId": gameid
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
        region: 'ap-northeast-1'
    });
    
    const dataToSend = {
            playerIds: data.Item.players,
            publicGameId: gameid  
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
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(canGameBegin)
    };
    return response;
};
