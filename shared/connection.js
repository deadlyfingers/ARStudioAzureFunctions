const util = require('util');
const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

// MongoDB config (local.settings.json)
const host = process.env.MongoDBHost || 'localhost';
const port = process.env.MongoDBPort || '27017';
const user = process.env.MongoDBUser || '';
const pass = process.env.MongoDBPass || '';
const database = process.env.DatabaseName || 'arstudio';

var params = '';
if (process.env.WEBSITE_NODE_DEFAULT_VERSION) {
  params = "?ssl=true&replicaSet=globaldb"; // Azure Cosmos DB accounts require secure communication via SSL.
}

// MongoDB connection
const connectionUri = (!user || !pass)
  ? 'mongodb://' + host + '/' + database
  : util.format('mongodb://%s:%s@%s:%s/%s%s', user, pass, host, port, database, params);
const connection = mongoose.connect(connectionUri, { 'useMongoClient': true });

module.exports = {
  connection,
  mongoose
};