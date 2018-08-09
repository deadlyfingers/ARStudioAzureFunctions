const Lobby = require("../shared/models").Lobby;
const doneError = require("../shared/functions").doneError;
const doneSuccess = require("../shared/functions").doneSuccess;

module.exports = function(context, req) {
  if (!(req.query.id || (req.body && req.body.id))) {
    return doneError(context, "'id' param is required", 400);
  }

  const id = req.query.id || req.body.id;

  // Delete Lobby by id
  Lobby.findByIdAndRemove(id, function(err, doc) {
    if (err) {
      return doneError(context, err);
    }
    const message = "Lobby was removed";
    if (!doc) {
      // Already deleted
      return doneSuccess(context, { message }, 202);
    }
    return doneSuccess(context, { message }, 200);
  });

};