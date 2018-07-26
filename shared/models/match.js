const m = require('../connection').mongoose;
const Schema = m.Schema;

const Match = new Schema({
  'ownerId': { 'type': String, 'required': true },
  'opponentId': { 'type': String, 'required': true },
  'ownerReady': { 'type': Boolean, 'default': false },
  'opponentReady': { 'type': Boolean, 'default': false },
  'ownerMove': { 'type': Number, 'min': 0, 'max': 2 },
  'opponentMove': { 'type': Number, 'min': 0, 'max': 2 },
  'winnerResult': { 'type': Number, 'min': 0, 'max': 2 },
  'winnerMessage': { 'type': String },
  'matches': { 'type': Number, 'default': 0 }
}, {
  'timestamps': true
});

Match.virtual('matchId').get(function() {
  return this._id;
});

module.exports = Match;