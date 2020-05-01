var cons = require('./constants.js')
var util = require('./utils.js')
var db = require('./db/db.js')

var amass = require('./recon/amass.js')
var gau = require('./recon/gau.js')

var args = process.argv.slice(2)

async function recon(domain){
  await amass.recon(domain)

  //db.close()
}

if(args.length > 0){

  db.connectToServer(function(err,client){
    if(err) util.debug(err);

    var domain = args[0]
    util.debug("Engine started for "+domain)
    recon(domain)
  })
}
