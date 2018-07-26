const Match = require("../shared/models").Match;
const doneError = require("../shared/functions").doneError;
const doneSuccess = require("../shared/functions").doneSuccess;

module.exports = function(context, req) {
  context.log('Check match status');

  // var outputFormatter;
  var projection;

  if (req.query.result || (req.body && req.body.result)) {
    // outputFormatter = resultFormatter;
    projection = {
      'matches': 1,
      'winnerMessage': 1,
      'winnerResult': 1
    }
  } else {
    projection = {
      'matches': 1,
      'opponentReady': 1,
      'ownerReady': 1
    };
  }

  if (req.query.id || (req.body && req.body.id)) {
    const id = req.query.id || req.body.id;
    findMatchById(context, id, projection);
  } else if (req.query.playerId || (req.body && req.body.playerId)) {
    const id = req.query.playerId || req.body.playerId;
    var conditions = {
      'ownerId': id
    };
    findMatchWithConditions(context, conditions, projection);
  } else {
    doneError(context, "Match 'id' or 'playerId' param is required", 400);
  }
};

const findMatchById = function(context, id, projection = {}) {
  return Match.findById(id, projection, function(err, match) {
    if (err) return doneError(context, err);
    if (match === null) {
      return doneError(context, "Match 'id' not found");
    }

    // found match!
    context.log("Found match: \n" + match._id);
    return doneSuccess(context, match); // formatter(match)
  });
}

const findMatchWithConditions = function(context, conditions = {}, projection = {}) {
  return Match.findOne(conditions, projection, function(err, match) {
    if (err) return doneError(context, err);
    if (match === null) {
      return doneError(context, "Match not found: " + (conditions && conditions.ownerId));
    }

    // found match!
    context.log("Found match: \n" + match._id);
    return doneSuccess(context, match); // formatter(match)
  });
}

// formatter = (doc) => doc
// const resultFormatter = function(doc) {
//     const { winnerId, winnerMessage } = doc;
//     return {
//         winnerMessage
//     };
// }