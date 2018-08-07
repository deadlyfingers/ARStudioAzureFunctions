const getHost = require("./helpers").getHost;

const _host = getHost(process.env.AzureWebJobsDashboard || "http://localhost:7071");
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