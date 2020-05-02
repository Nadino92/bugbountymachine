var cons = require('../constants.js')
var util = require('../utils.js')

const MongoClient = require('mongodb').MongoClient;
var _db;

// Connection URL
const url = 'mongodb://localhost:27017';

module.exports = {
  connectToServer: function(callback){
      MongoClient.connect(url, function(err,db){
      _db = db
      return callback(err);
    })
  },
  getDb: function(){
    return _db.db(cons.dbName);
  },
  close: function(){
    _db.close()
  }
}
