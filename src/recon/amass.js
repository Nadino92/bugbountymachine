var cons = require('../constants.js')
var util = require('../utils.js')
var db = require('../db/db.js')

var xss = require('../attack/xss.js')
var nuclei = require('../attack/nuclei.js')
var zap = require('../attack/zap.js')

var gau = require('./gau.js')

var fs = require('fs')
var lr = require('line-reader')
var path = require('path')

function alreadyScanned(domain) {
  var obj = {domain: {$regex: /.*${domain}.*/}}
  let res = db.getDb().collection(cons.dbDomain).find(obj).toArray(function(err,docs){
    console.log(JSON.stringify(docs))
    console.log(docs.length)

    if(docs){
      return true
    } else {
      return false
    }
  })
}

module.exports.recon = async function(line){

  var tmpPath = path.resolve(__dirname)+"/../../tmp/"

  if(alreadyScanned(line)){
    util.debug("Already scanned "+line)
    return true
  }

  fs.mkdirSync(tmpPath+line+"_dir")

  util.debug("Starting amass for "+line)
  util.execSync(cons.cmdAmass+line+" | "+cons.cmdHttprobe+" > $BBDIR/tmp/"+line)

  util.debug("Finished amass for "+line)

  lr.eachLine(tmpPath+line, function(domain, last){
    try{
      var name = domain.split("://")[1]+"_gau"
      util.debug("Name for gau "+name)

      util.execSync("gau "+domain+" 1 > $BBDIR/tmp/"+line+"_dir/"+name+" 2> /dev/null")

      xss.test(tmpPath+line+"_dir/"+name)
    } catch(e) {/*nada, this is buggy*/}

    util.debug('domain '+domain)
    var obj = {domain: domain};

    db.getDb().collection(cons.dbDomain).insertOne(obj)

    if(last) {
      util.debug("Recon is over for "+line)
      return true
    }
  })

  return true
}
