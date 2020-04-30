var cons = require('../constants.js')
var util = require('../utils.js')
var db = require('../db/db.js')

lr = require('line-reader')

lr.eachLine('../../inscope.txt', function(line){
  util.debug("line "+line)

  util.execSync(cons.cmdAmass+line+" | "+cons.cmdHttprobe+" > $BBDIR/tmp/"+line)

  lr.eachLine('../../tmp/'+line, function(domain){
    util.debug('domain '+domain)
    var obj = {domain: domain};
    db.db.collection(cons.dbDomain).insertOne(obj, function(err,res){
      if(err) throw err;
      console.log("1 doc inserted "+domain)
    })
  })

})
