var cons = require('./constants.js')
var util = require('./utils.js')
var db = require('./db/db.js')

var amass = require('./recon/amass.js')

var args = process.argv.slice(2)

async function recon(domain){
  amass.recon(domain)

  var notEmpty = true

  while (notEmpty){
    var obj = {phase1:false, domain: {$regex: ".*"+domain}}
    db.getDb().collection(cons.dbDomain).find(obj).toArray(function(err,docs){

      console.log("Still to be proccess "+docs.length)

      notEmpty = docs.length > 0
    })

    console.log("notEmpty ? "+notEmpty)
    await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
  }

  console.log("Closing DB")
  db.close()
}

if(args.length > 0){

  db.connectToServer(function(err,client){
    if(err) util.debug(err);

    var domain = args[0]
    util.debug("Engine started for "+domain)
    recon(domain)
  })
}
