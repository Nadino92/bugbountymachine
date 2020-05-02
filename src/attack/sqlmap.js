var cons = require("../constants.js")
var util = require("../utils.js")

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
          console.log("adding "+key+" to set from "+item.href)
          set.add(key)
          proc.execSync("python3 $BBDIR/sqlmap-dev/sqlmap.py --timeout 2 --batch -u '"+item.href+"' > x.txt && cat x.txt | grep 'might be injectable' && rm x.txt", async (error, stdout, stderr) => {
              if (error) {
                  //console.log(`error: ${error.message}`);
                  //util.sendError(error.message, "sqlmap --batch -u "+item.href+" | grep 'might be injectable'")
              }

              if(stdout){console.log("sqlmap STDOUT "+stdout)}
          }).catch(e => console.log(e))

          break;
        }
      }
    }
  }
}
