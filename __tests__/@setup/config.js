const getHost = require("./helpers").getHost;

const _host = getHost(process.env.AzureWebJobsDashboard || "http://localhost:7071");
const _apiUri = _host + "/api/";
// console.log("Host " + _host + "\nApi " + _apiUri);

const Api = {
  'LobbyCreate': _apiUri + "LobbyCreate",
  'LobbyJoin': _apiUri + "LobbyJoin",
  'MatchReady': _apiUri + "MatchReady",
  'MatchStatus': _apiUri + "MatchStatus",
  'MatchTurn': _apiUri + "MatchTurn"
}

module.exports = {
  Api
};