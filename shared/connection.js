const util = require('util');
const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

// MongoDB config (local.settings.json)
const host = process.env.MongoDBHost || 'localhost';
const port = process.env.MongoDBPort || '27017';
const user = process.env.MongoDBUser || '';
const pass = process.env.MongoDBPass || '';
const database = process.env.DatabaseName || 'arstudio';

// MongoDB connection
const options = {};
const connectionUri = (!user || !pass)
  ? 'mongodb://' + host + '/' + database
  : util.format('mongodb://%s:%s@%s:%s/%s', user, pass, host, port, database);
const connection = mongoose.createConnection(connectionUri, options);

module.exports = {
  connection,
  mongoose
};