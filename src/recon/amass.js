var cons = require('../constants.js')
var util = require('../utils.js')
var mongo = require('../db/db.js')

var lr = require('line-reader')
var path = require('path')

module.exports.recon = async function(line){

  util.execSync(cons.cmdAmass+line+" | "+cons.cmdHttprobe+" > $BBDIR/tmp/"+line)

  util.debug("Finished amass for "+line)

  util.debug(path.resolve(__dirname)+"/../../tmp/"+line)

  return true

  /*
  var result = db.collection(cons.dbDomain).find({domain: line}).toArray(function(err,res){
    if(err) throw err;
    util.debug(res);
    result = res
  })

  lr.eachLine(path.resolve(__dirname)+"/../../tmp/"+line, function(domain, last){

    util.debug('domain '+domain)
    var obj = {domain: domain};

    db.collection(cons.dbDomain).insertOne(obj, function(err,res){
      if(err) throw err;
      console.log("1 doc inserted "+domain)
    })

    if(last) {
      util.debug("This is over "+domain)
      return true
    }
  })*/
}
