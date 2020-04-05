const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {
        pathParameters: { publicGameId }
    } = event; // Extracting an id from the request path
    
    const { playerId, cardId, answer } = JSON.parse(event.body);
    console.log(answer);
    
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
    
    const resp = await documentClient.put(updateCards).promise();
    
    const response = {
        statusCode: 200
    };
    return response;
};
