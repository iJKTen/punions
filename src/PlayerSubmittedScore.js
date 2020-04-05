const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    let updateScore = true;
    const {
        pathParameters: { publicGameId }
    } = event; // Extracting an id from the request path
    
    const { scoringPlayerId, scoreForPlayerId, cardId, score } = JSON.parse(event.body);
    
    const params = {
        TableName: "Game",
        Key: { 
            "PublicGameId": publicGameId
        }
    }
    
    const gameData = await documentClient.get(params).promise();
    let currentPlayer = gameData.Item.players.find(player => player.playerId === scoreForPlayerId);
    let card = currentPlayer.cards.find(card => card.cardId === cardId);

    if(!card["scoringPlayers"]) {
        card["scoringPlayers"] = [scoringPlayerId];
        card["score"] = card["score"] ? card["score"] + 1 : 1;
    }
    else {
        const indexOfScoringPlayer = card.scoringPlayers.findIndex(playerId => playerId === scoringPlayerId);
        if(indexOfScoringPlayer > 0) {
            card["scoringPlayers"].push(scoringPlayerId);
            card["score"] = card["score"] ? card["score"] + 1 : 1;
        }
        else {
            updateScore = false;
        }
    }
    
    if(updateScore) {
        const updateCards = {
            TableName: "Game",
            Item: gameData.Item
        }
    
        const resp = await documentClient.put(updateCards).promise();   
    }
    
    const response = {
        statusCode: 200
    };
    return response;
};
