const getHost = require("./helpers").getHost;

// Requires Azure Function 'AccountName' and 'defaultCode' environment vars
const _host = getHost(process.env.AccountName || "http://localhost:7071");
const _apiUri = _host + "/api/";
// console.info("Host:", _host, "\nFunctions Api:", _apiUri, "\nCode:", process.env.defaultCode);

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