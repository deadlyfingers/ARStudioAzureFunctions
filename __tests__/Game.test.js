const frisby = require('frisby');
const Joi = frisby.Joi;
const Api = require("./@setup/config").Api;

var matchId, pin, player1Id; // player1Id uses lobby id
var player2Id = "p2";
var matches = 0;
var player1Move = 1;
var player2Move = 2;
var winnerResult = 1; // 0 = draw, 1 = Player 1 wins, 2 = Player 2 wins

it('Create private Lobby using pin', function(done) {
  return frisby
    .get(Api.LobbyCreate + "?private=true&pinLength=9")
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
  return frisby
    .get(Api.LobbyJoin + "?pin=" + pin + "&playerId=" + player2Id)
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
  return frisby
    .get(Api.MatchStatus + "?playerId=" + player1Id)
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
  return frisby
    .get(Api.MatchStatus + "?id=" + matchId)
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
  return frisby
    .get(Api.MatchReady + "?id=" + matchId + "&playerId=" + player1Id)
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
  return frisby
    .get(Api.MatchReady + "?id=" + matchId + "&playerId=" + player2Id)
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
  return frisby
    .get(Api.MatchStatus + "?id=" + matchId)
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
  return frisby
    .get(Api.MatchTurn + "?id=" + matchId + "&playerId=" + player1Id + "&move=" + player1Move)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Get match result status', function(done) {
  return frisby
    .get(Api.MatchStatus + "?id=" + matchId + "&result=true")
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Player 2 moves', function(done) {
  return frisby
    .get(Api.MatchTurn + "?id=" + matchId + "&playerId=" + player2Id + "&move=" + player2Move)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Get match winner result status', function(done) {
  return frisby
    .get(Api.MatchStatus + "?id=" + matchId + "&result=true")
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
  return frisby
    .get(Api.MatchStatus + "?id=" + matchId)
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
  return frisby
    .get(Api.MatchReady + "?id=" + matchId + "&playerId=" + player2Id)
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
  return frisby
    .get(Api.MatchReady + "?id=" + matchId + "&playerId=" + player1Id)
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
  return frisby
    .get(Api.MatchTurn + "?id=" + matchId + "&playerId=" + player2Id + "&move=" + 0)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Player 1 moves #2', function(done) {
  return frisby
    .get(Api.MatchTurn + "?id=" + matchId + "&playerId=" + player1Id + "&move=" + 0)
    .expect('status', 200)
    .expect('jsonTypes', {
      '_id': Joi.string()
    })
    .done(done);
});

it('Get match #2 winner result status', function(done) {
  return frisby
    .get(Api.MatchStatus + "?id=" + matchId + "&result=true")
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
  return frisby
    .get(Api.MatchStatus + "?id=" + matchId)
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