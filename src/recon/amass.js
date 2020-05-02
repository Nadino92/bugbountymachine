var cons = require('../constants.js')
var util = require('../utils.js')
var db = require('../db/db.js')

var xss = require('../attack/xss.js')
var nuclei = require('../attack/nuclei.js')
var zap = require('../attack/zap.js')
var sqlmap = require('../attack/sqlmap.js')

var gau = require('./gau.js')

var fs = require('fs')
var lr = require('line-reader')
var path = require('path')
var proc = require('child_process')

function alreadyScanned(domain) {
  var obj = {domain: {$regex: ".*"+domain}}

  return new Promise(function(resolve, reject){
    db.getDb().collection(cons.dbDomain).find(obj).toArray(function(err,docs){
      console.log("ERROR DURING RETRIVE "+err)
      console.log(JSON.stringify(docs))
      console.log(docs.length)

      if(err){
        reject(err)
      } else {
        resolve(docs)
      }
    })
  })
}

module.exports.recon = async function(line){

  //avoid duplicates
  var set = new Set()
  //tmp path for files
  var tmpPath = path.resolve(__dirname)+"/../../tmp/"

  let alrScan = await alreadyScanned(line)

  console.log("ALREADY SCANNED? "+alrScan.length)

  if(alrScan.length > 0){
    util.debug("Already scanned "+line)
    return true
  }

  if(!fs.existsSync(tmpPath+line+"_dir")){
    fs.mkdirSync(tmpPath+line+"_dir")
  }

  util.debug("Starting amass for "+line)
  util.execSync(cons.cmdAmass+line+" | "+cons.cmdHttprobe+" > $BBDIR/tmp/"+line)

  util.debug("Finished amass for "+line)

  lr.eachLine(tmpPath+line, async function(domain, last){

    if(!set.has(domain)) {
      set.add(domain)

      var name = domain.split("://")[1]+"_gau"

      util.debug("Name for gau "+name)

      proc.exec("gau "+domain, {maxBuffer: 100*1024*1024}, async (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            util.sendError(error.message, "gau "+domain)
            //we will log what happened
            return
        }

        var gaurls = stdout.split(/[\r\n]+/)

        util.debug("Gau extracted "+name)

        let urls = await util.validUrlScheme(gaurls,domain.split("://")[0])

        util.debug("URLS validate ")

        if(urls.size > 0){
          //phase1 attack starts
          //xss.test(urls)
          sqlmap.test(urls)
        }

        return
      })

      util.debug('domain '+domain)
      var obj = {domain: domain, phase1: false, phase2: false, phase3: false, crashed: false};

      db.getDb().collection(cons.dbDomain).insertOne(obj)
    }

    if(last) {
      util.debug("Recon is over for "+line)
      return true
    }
  })

  return true
}
