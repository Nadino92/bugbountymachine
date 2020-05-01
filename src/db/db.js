var cons = require('../constants.js')
var util = require('../utils.js')

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
module.exports.insertOne = function(coll,obj){
  MongoClient.connect(url, function(err,db){
    if(err) throw err;
    var dbo = db.db(cons.dbName);

    dbo.collection(coll).insertOne(obj, function(err,res){
      if(err) throw err;
      util.debug("1 document insert")
      db.close()
    })
  })
}
