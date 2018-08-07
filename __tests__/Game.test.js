const frisby = require('frisby');
const Joi = frisby.Joi;
const Api = require("./@setup/config").Api;
const queryString = require("./@setup/helpers").queryString;

var matchId, pin, player1Id; // player1Id uses lobby id
var player2Id = "p2";
var matches = 0;
var player1Move = 1;
var player2Move = 2;
var winnerResult = 1; // 0 = draw, 1 = Player 1 wins, 2 = Player 2 wins

it('Create private Lobby using pin', function(done) {
  const query = queryString({
    "pinLength": 9,
    "private": true
  });
  return frisby
    .get(Api.LobbyCreate + query)
    .expect('status', 201)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'createdAt': Joi.string(),
      'pin': Joi.string(),
      'private': Joi.boolean()
    })
    .expect('json', {
      'private': true
    })
    .then(function(res) {
      const json = res.json;
      pin = json.pin;
      player1Id = json._id;
    })
    .done(done);
});

it('Join private Lobby with pin and create Match', function(done) {
  const query = queryString({
    "pin": pin,
    "playerId": player2Id
  });
  return frisby
    .get(Api.LobbyJoin + query)
    .expect('status', 201)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'createdAt': Joi.string(),
      'updatedAt': Joi.string()
    })
    .then(function(res) {
      const json = res.json;
      matchId = json._id;
    })
    .done(done);
});

it('Match ready status for Player 1 should be false', function(done) {
  const query = queryString({
    "playerId": player1Id
  });
  return frisby
    .get(Api.MatchStatus + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'matches': Joi.number(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'matches': matches,
      'ownerReady': false
    })
    .done(done);
});

it('Match ready status for Player 2 should be false', function(done) {
  const query = queryString({
    "id": matchId
  });
  return frisby
    .get(Api.MatchStatus + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'matches': Joi.number(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'matches': matches,
      'opponentReady': false
    })
    .done(done);
});

it('Player 1 is Ready', function(done) {
  const query = queryString({
    "id": matchId,
    "playerId": player1Id
  });
  return frisby
    .get(Api.MatchReady + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'ownerReady': true
    })
    .done(done);
});

it('Player 2 is Ready', function(done) {
  const query = queryString({
    "id": matchId,
    "playerId": player2Id
  });
  return frisby
    .get(Api.MatchReady + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'opponentReady': true
    })
    .done(done);
});

it('Match ready status for players should be true', function(done) {
  const query = queryString({
    "id": matchId
  });
  return frisby
    .get(Api.MatchStatus + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'matches': Joi.number(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'matches': matches,
      'opponentReady': true,
      'ownerReady': true
    })
    .done(done);
});

it('Player 1 moves', function(done) {
  const query = queryString({
    "id": matchId,
    "move": player1Move,
    "playerId": player1Id
  });
  return frisby
    .get(Api.MatchTurn + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Get match result status', function(done) {
  const query = queryString({
    "id": matchId,
    "result": true
  });
  return frisby
    .get(Api.MatchStatus + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Player 2 moves', function(done) {
  const query = queryString({
    "id": matchId,
    "move": player2Move,
    "playerId": player2Id
  });
  return frisby
    .get(Api.MatchTurn + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Get match winner result status', function(done) {
  const query = queryString({
    "id": matchId,
    "result": true
  });
  return frisby
    .get(Api.MatchStatus + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'matches': Joi.number(),
      'winnerMessage': Joi.string(),
      'winnerResult': Joi.number()
    })
    .expect('json', {
      'matches': (matches + 1),
      'winnerResult': winnerResult
    })
    .then(function() {
      // const json = res.json;
      matches += 1;
      // console.log((json.winnerResult > 0) ? "#" + matches + " Player " + json.winnerResult + " wins. " + json.winnerMessage : "#" + matches + " Draw. " + json.winnerMessage);
    })
    .done(done);
});

it('Match ready status for Players should be reset to false', function(done) {
  const query = queryString({
    "id": matchId
  });
  return frisby
    .get(Api.MatchStatus + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'matches': Joi.number(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'matches': matches,
      'opponentReady': false,
      'ownerReady': false
    })
    .done(done);
});

// rematch

it('Player 2 is Ready for rematch', function(done) {
  const query = queryString({
    "id": matchId,
    "playerId": player2Id
  });
  return frisby
    .get(Api.MatchReady + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'opponentReady': true
    })
    .done(done);
});

it('Player 1 is Ready for rematch', function(done) {
  const query = queryString({
    "id": matchId,
    "playerId": player1Id
  });
  return frisby
    .get(Api.MatchReady + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'ownerReady': true
    })
    .done(done);
});

it('Player 2 moves #2', function(done) {
  const query = queryString({
    "id": matchId,
    "move": 0,
    "playerId": player2Id
  });
  return frisby
    .get(Api.MatchTurn + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Player 1 moves #2', function(done) {
  const query = queryString({
    "id": matchId,
    "move": 0,
    "playerId": player1Id
  });
  return frisby
    .get(Api.MatchTurn + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Get match #2 winner result status', function(done) {
  const query = queryString({
    "id": matchId,
    "result": true
  });
  return frisby
    .get(Api.MatchStatus + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'matches': Joi.number(),
      'winnerMessage': Joi.string(),
      'winnerResult': Joi.number()
    })
    .expect('json', {
      'matches': (matches + 1),
      'winnerResult': 0
    })
    .then(function() {
      // const json = res.json;
      matches += 1;
      // console.log((json.winnerResult > 0) ? "#" + matches + " Player " + json.winnerResult + " wins. " + json.winnerMessage : "#" + matches + " Draw. " + json.winnerMessage);
    })
    .done(done);
});

it('Match ready status for Players should be reset to false', function(done) {
  const query = queryString({
    "id": matchId
  });
  return frisby
    .get(Api.MatchStatus + query)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string(),
      'matches': Joi.number(),
      'opponentReady': Joi.boolean(),
      'ownerReady': Joi.boolean()
    })
    .expect('json', {
      'matches': matches,
      'opponentReady': false,
      'ownerReady': false
    })
    .done(done);
});