const connection = require('./connection').connection;

/*
 * hook up models to an active db connection for saving
 * See https://www.npmjs.com/package/mongoose
 */
const Lobby = require('./models/lobby');
const Match = require('./models/match');

module.exports = {
  "Lobby": connection.model('Lobby', Lobby),
  "Match": connection.model('Match', Match)
}