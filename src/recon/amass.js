var cons = require('../constants.js')
var util = require('../utils.js')
var db = require('../db/db.js')

var xss = require('../attack/xss.js')
var nuclei = require('../attack/nuclei.js')
var sqlmap = require('../attack/sqlmap.js')

var fs = require('fs')
var lr = require('line-reader')
var path = require('path')
var proc = require('child_process')

function alreadyScanned(domain) {
  var obj = {domain: {$regex: ".*"+domain}}

  return new Promise(function(resolve, reject){
    db.getDb().collection(cons.dbDomain).find(obj).toArray(function(err,docs){
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

  util.debug("Starting amass for "+line)

  var tmpfile = "$BBDIR/tmp/tmp_"+line
  var massdns = "echo "+line+" > "+line+";$BBDIR/massdns/bin/massdns -r $BBDIR/massdns/lists/resolvers.txt -t AAAA -w "+line+" > "+tmpfile
  var amass = cons.cmdAmass+line+" >> "+tmpfile
  var dnsgen = "dnsgen " + tmpfile +" -w $BBDIR/w.txt >> "+tmpfile

  //util.execSync(massdns)
  util.debug("massdns done "+line)
  util.execSync(amass)
  util.debug("Amass done "+line)
//  util.execSync(dnsgen)
  util.debug("Dnsgen done "+line)
  util.execSync("cat "+tmpfile+" | "+cons.cmdHttprobe+" > $BBDIR/tmp/"+line)
  util.debug("Httprobe done "+line)
  util.execSync("rm "+tmpfile)

  util.debug("Finished recon for "+line)

  util.debug("START OF NUCLEI FOR "+line)

  await nuclei.start(line)

  util.debug("END OF NUCLEI FOR "+line)

  lr.eachLine(tmpPath+line, async function(domain, last){

    if(!set.has(domain)) {
      set.add(domain)

      util.debug('domain '+domain)
      var obj = {domain: domain, phase1: false, phase2: false, crashed: false};

      db.getDb().collection(cons.dbDomain).insertOne(obj)

      util.debug("Starting gau "+domain)
      proc.exec("gau "+domain, {maxBuffer: 100*1024*1024}, async (error, stdout, stderr) => {
        if (error) {
            util.debug(`error: ${error.message}`);
            util.sendError(error.message, "gau "+domain)
            //we will log what happened
            return
        }

        var gaurls = stdout.split(/[\r\n]+/)

        util.debug("Gau extracted "+domain)

        let urls = await util.validUrlScheme(gaurls,domain.split("://")[0])

        util.debug("URLS validate "+urls.length)

        if(urls.size > 0 && urls.size < cons.maxUrls){
          //phase1 attack starts
          await xss.test(urls)

          if(urls.size < cons.maxUrls / 3){
            await sqlmap.test(urls)
          }
        }

        db.getDb().collection(cons.dbDomain).updateOne(
            {domain: domain},
            { $set: { phase1: true }
          })

        util.debug("END OF PHASE1 FOR "+domain)

        util.debug("START OF PHASE2 (ZAP) FOR "+domain)

        if(urls.size < cons.maxUrls){
          util.execSync("python3 $BBDIR/src/attack/zap.py "+domain)
        }

        db.getDb().collection(cons.dbDomain).updateOne(
            {domain: domain},
            { $set: { phase2: true }
          })

        util.debug("END OF PHASE2 FOR "+domain)
      })
    }

    if(last) {
      util.debug("Recon is over for "+line)
      return
    }
  })
}
