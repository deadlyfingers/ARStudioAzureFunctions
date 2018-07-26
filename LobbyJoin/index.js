const Lobby = require("../shared/models").Lobby;
const Match = require("../shared/models").Match;
const doneError = require("../shared/functions").doneError;
const doneSuccess = require("../shared/functions").doneSuccess;
const outputId = require("../shared/functions").outputId;

module.exports = function(context, req) {
  context.log('Join lobby and start match');

  if (!(req.query.playerId || (req.body && req.body.playerId))) {
    return doneError(context, "'playerId' param is required", 400);
  }

  var conditions = {
    'private': false
  };
  if (req.query.pin || (req.body && req.body.pin)) {
    conditions.pin = req.query.pin || req.body.pin;
    conditions.private = true;
  }

  // options
  var sort = { 'createdAt': 1 };
  Lobby.findOneAndRemove(conditions, { sort }, function(err, lobby) {
    if (err) return doneError(context, err);
    if (lobby === null) {
      return doneError(context, "Lobby not found", 202);
    }

    // found lobby!
    context.log("Found lobby: \n" + lobby._id);
    var data = {};
    data.ownerId = lobby._id;
    data.opponentId = req.query.playerId || req.body.playerId;

    // create new match!
    Match.create(data, function(error, doc) {
      if (error) return doneError(context, error);
      // saved!
      doneSuccess(context, outputId(doc), 201);
    });
  });
};