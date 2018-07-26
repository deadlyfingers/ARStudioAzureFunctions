const m = require('../connection').mongoose;
const Schema = m.Schema;

const Lobby = new Schema({
  'createdAt': { 'type': Date, 'default': Date.now },
  'pin': { 'type': String },
  'private': { 'type': Boolean, 'default': false }
});

Lobby.virtual('ownerId').get(function() {
  return this._id;
});

module.exports = Lobby;