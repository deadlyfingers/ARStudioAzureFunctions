const Match = require("../shared/models").Match;
const doneError = require("../shared/functions").doneError;
const doneSuccess = require("../shared/functions").doneSuccess;
const outputId = require("../shared/functions").outputId;

module.exports = function(context, req) {
  context.log('Submit move');

  if (
    (!req.query.id || (req.body && !req.body.id)) ||
    (!req.query.playerId || (req.body && !req.body.playerId)) ||
    (!req.query.move || (req.body && !req.body.move))
  ) {
    return doneError(context, "Match 'id', 'playerId' and 'move' param is required", 400);
  }

  var id = req.query.id || req.body.id;
  var playerId = req.query.playerId || req.body.playerId;
  var move = parseInt(req.query.move || req.body.move);

  // validate move
  if (move < 0 || move > 2) {
    return doneError(context, "Invalid move int: " + move, 400);
  }

  Match.findById(id, function(err, match) {
    if (err) return doneError(context, err);

    if (!match) {
      return doneError(context, "Match not found using id: " + id, 404);
    }

    // found match!
    context.log("Found match: \n" + match._id);

    var needsUpdate = false;
    if (playerId === match.ownerId) {
      if (typeof match.ownerMove === 'undefined') {
        match.ownerMove = move;
        needsUpdate = true;
      }
    } else if (playerId === match.opponentId) {
      if (typeof match.opponentMove === 'undefined') {
        match.opponentMove = move;
        needsUpdate = true;
      }
    } else {
      return doneError(context, "Move update failed using playerId: " + playerId + " with match id: " + id);
    }

    if (!needsUpdate) {
      return doneError(context, "Already moved playerId: " + playerId + " with match id: " + id, 400);
    }

    // check both players are ready before recording any moves
    if (match.ownerReady === false || match.opponentReady === false) {
      return doneError(context, "Both players must be ready before moving!", 400);
    }

    // evalute winner
    if (match.ownerMove >= 0 && match.opponentMove >= 0) {
      var winnerResult = evaluateMoves(match.ownerMove, match.opponentMove);
      var winnerMessage = getWinningMessage(match.ownerMove, match.opponentMove);

      if (winnerResult === -1) {
        return doneError(context, "Invalid move result with match id: " + id, 400);
      }

      match.winnerResult = winnerResult;
      match.winnerMessage = winnerMessage;
      match.matches += 1;
      // reset
      match.ownerReady = false;
      match.opponentReady = false;
      match.ownerMove = undefined;
      match.opponentMove = undefined;
    }

    match.save(function(error, updatedMatch) {
      if (error) return doneError(context, error);
      // updated match!
      const { _id, ownerMove, opponentMove } = updatedMatch;
      context.log("Updated match move: \n" + _id + " p1:" + ownerMove + " p2:" + opponentMove);
      doneSuccess(context, outputId(updatedMatch));
    });
  });

};

const evaluateMoves = function(p1Move, p2Move) {
  var result = p1Move - p2Move;
  if (result === 0) {
    // draw
    return 0;
  } else if (result === -1 || result === 2) {
    // player 1 wins
    return 1;
  } else if (result === 1 || result === -2) {
    // player 2 wins
    return 2;
  }
  // unknown result
  return -1;
}

const getWinningMessage = function(p1Move, p2Move) {
  const elements = ["Fire", "Earth", "Water"]; // ["Rock", "Scissors", "Paper"]
  const verbs = ["burns", "drinks", "extinguishes"]; // ["smashes", "cuts", "covers"]
  var winner = evaluateMoves(p1Move, p2Move);
  if (winner === 1) {
    // player 1 wins
    const verb = verbs[p1Move] || "beats";
    return `${elements[p1Move]} ${verb} ${elements[p2Move]}`;
  } else if (winner === 2) {
    // player 2 wins
    const verb = verbs[p2Move] || "beats";
    return `${elements[p2Move]} ${verb} ${elements[p1Move]}`;
  } else if (winner === 0) {
    // draw
    return `${elements[p1Move]} draws`;
  }
  // unknown result
  return "";
}