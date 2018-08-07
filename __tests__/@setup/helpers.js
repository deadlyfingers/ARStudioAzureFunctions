const getHost = function(delimitedKeyValueString) {
  var accountName = getValue(delimitedKeyValueString, "AccountName");
  if (accountName.substring(0, 4) !== "http") {
    accountName = "https://" + accountName + ".azurewebsites.net";
  }
  return accountName;
}

const getValue = function(delimitedKeyValueString, key) {
  var components = delimitedKeyValueString.split(';');
  if (components.length === 1) {
    return delimitedKeyValueString;
  }
  var dict = {};
  components.forEach(function(component) {
    var kv = component.split('=');
    if (kv && kv.length === 2) {
      dict[kv[0]] = kv[1];
    }
  });
  return dict[key] || delimitedKeyValueString;
}

// converts a key-value object into a GET query string
const queryString = function(keyValueParams = {}) {
  // if (!params) { return ""; }
  var params = keyValueParams || {};
  if (params && !params.code && process.env.defaultCode) {
    params.code = process.env.defaultCode;
  }
  var q = "";
  Object.keys(params).forEach(function(key, i) {
    var delimiter = (i > 0) ? "&" : "?";
    var value = (key === "code") ? params[key] : encodeURIComponent(params[key]);
    q += delimiter + encodeURIComponent(key) + "=" + value;
  });
  return q;
};

module.exports = {
  getHost,
  getValue,
  queryString
};