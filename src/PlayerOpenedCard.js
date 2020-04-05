const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    const {
        pathParameters: { publicGameId }
    } = event; // Extracting an id from the request path
    
    const { playerId, cardId } = JSON.parse(event.body);
    
    const params = {
        TableName: "Game",
        Key: { 
            "PublicGameId": publicGameId
        }
    }
    
    const gameData = await documentClient.get(params).promise();
    
    let player = gameData.Item.players.find(player => player.playerId === playerId);
    if (!player["cards"]) {
        player["cards"] = [];
    }
    
    player.cards.push({ "cardId": cardId });
    
    const updateGame = {
        TableName: "Game",
        Item: gameData.Item
    }
    
    const resp = await documentClient.put(updateGame).promise();
    
    const response = {
        statusCode: 200
    };
    return response;
};
