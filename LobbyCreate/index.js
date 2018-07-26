const Lobby = require("../shared/models").Lobby;
const doneError = require("../shared/functions").doneError;
const doneSuccess = require("../shared/functions").doneSuccess;

module.exports = function(context, req) {
  if (req.query.private || (req.body && req.body.private)) {
    var data = {};
    data.private = true;

    if (req.query.pinLength || (req.body && req.body.pinLength)) {
      var l = parseInt(req.query.pinLength || req.body.pinLength);
      var clampedLength = Math.min(Math.max(l, 3), 9);
      data.pin = randomPin(clampedLength);
    } else {
      data.pin = randomPin();
    }

    // Check if private game with pin already exists before creating one
    Lobby.findOne(data, function(err, doc) {
      if (err) {
        return doneError(context, err);
      }
      if (doc) {
        // Already used!
        return doneError(context, "Opps, failed to create private lobby with unique pin at this time!", 202);
      }
      // Ok create private lobby!
      context.log('Create private Lobby');
      createLobby(context, data);
    });
  } else {
    context.log('Create Lobby');
    createLobby(context);
  }
};

const createLobby = function(context, data = {}) {
  return Lobby.create(data, function(err, doc) {
    if (err) return doneError(context, err);
    // saved!
    return doneSuccess(context, doc, 201);
  });
}

const randomPin = function(len = 3, min = 0, max = 2) {
  var pin = "";
  while (len--) {
    pin += Math.floor((Math.random() * (max + 1 - min))) + min
  }
  return pin;
}

// Export functions for tests
module.exports.createLobby = createLobby;
module.exports.randomPin = randomPin;