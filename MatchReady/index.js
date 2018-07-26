const Match = require("../shared/models").Match;
const doneError = require("../shared/functions").doneError;
const doneSuccess = require("../shared/functions").doneSuccess;

module.exports = function(context, req) {
  context.log('Polling status...');

  if (!(
      (req.query.id || (req.body && req.body.id)) ||
      (req.query.playerId || (req.body && req.body.playerId))
    )) {
    return doneError(context, "Match 'id' and 'playerId' param is required", 400);
  }

  var id = req.query.id || req.body.id;
  var playerId = req.query.playerId || req.body.playerId;

  Match.findById(id, function(err, match) {
    if (err) return doneError(context, err);

    if (!match) {
      return doneError(context, "Match not found using id: " + id, 404);
    }

    // found match!
    context.log("Found match: \n" + match._id);

    var needsUpdate = false;
    if (playerId === match.ownerId) {
      if (!match.ownerReady) {
        match.ownerReady = true;
        needsUpdate = true;
      }
    } else if (playerId === match.opponentId) {
      if (!match.opponentReady) {
        match.opponentReady = true;
        needsUpdate = true;
      }
    } else {
      return doneError(context, "Ready status update failed using playerId: " + playerId + " with match id: " + id);
    }

    if (!needsUpdate) {
      return doneError(context, "No update required for playerId: " + playerId + " with match id: " + id, 400);
    }

    match.save(function(error, updatedMatch) {
      if (error) return doneError(context, error);
      // updated match!
      const { _id, ownerReady, opponentReady } = updatedMatch;
      context.log("Updated match: \n" + _id + " p1:" + ownerReady + " p2:" + opponentReady);
      doneSuccess(context, {
        _id,
        opponentReady,
        ownerReady
      });
    });
  });

};