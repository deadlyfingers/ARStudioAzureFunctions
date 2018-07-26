const getHost = function(delimitedKeyValueString) {
  var accountName = getValue(delimitedKeyValueString, "AccountName");
  if (accountName.substring(0, 4) !== "http") {
    accountName = "https://" + accountName;
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

module.exports = {
  getHost,
  getValue
};