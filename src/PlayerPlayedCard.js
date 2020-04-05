const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {
        pathParameters: { publicGameId }
    } = event;
    
    const { playerId, cardId, answer } = JSON.parse(event.body);
    
    const params = {
        TableName: "Game",
        Key: { 
            "PublicGameId": publicGameId
        }
    }
    
    const gameData = await documentClient.get(params).promise();
    let currentPlayer = gameData.Item.players.find(player => player.playerId === playerId);
    let card = currentPlayer.cards.find(card => card.cardId === cardId);
    
    card["answer"] = answer;
    currentPlayer["playing"] = false;
    
    const updateCards = {
        TableName: "Game",
        Item: gameData.Item
    }
    
    await documentClient.put(updateCards).promise();
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    };
    return response;
};
