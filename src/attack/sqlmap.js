var cons = require("../constants.js")
var util = require("../utils.js")
var slack = require('../alert/slack.js')

var proc = require("child_process")
var path = require('path')

var blacklistExt = ["html","js","css","png","jpg","svg","gif"]

module.exports.test = async function(urls){
  var set = new Set()

  for(let item of urls.keys()) {
    if(blacklistExt.includes(path.extname(item.pathname).substring(1))){
      continue
    }

    if(item.search){
      if(!item.search.substring(1)) { continue }

      var arrayParams = item.search.substring(1).split("&")

      for(let param of arrayParams){
        var key = param.split("=")[0]

        if(!set.has(key)){
          util.debug("adding "+key+" to set from "+item.href)
          set.add(key)

          var failed = false

          try{
            proc.execSync("python3 $BBDIR/sqlmap-dev/sqlmap.py --timeout 2 --batch -u '"+item.href+"' | grep 'might be injectable'")
          } catch(err) {failed = true}

          if(!failed){
            util.debug("SQQQQQQQQQQQLLLLLLLLLLLLL")
            slack.sendSqli(item.href)
          }

          break;
        }
      }
    }
  }

  return new Promise(function(resolve, reject){
    resolve("Done!")
  })
}
