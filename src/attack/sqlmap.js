var cons = require("../constants.js")
var util = require("../utils.js")

var proc = require("child_process")

module.exports.test = async function(urls){
  var set = new Set()

  for(let item of urls.keys()) {
    
      if(item.search){
        proc.exec("python3 $BBDIR/sqlmap-dev/sqlmap.py --timeout 2 --batch -u "+item.href+" | grep 'might be injectable'", async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                util.sendError(error.message, "sqlmap --batch -u "+item.href+" | grep 'might be injectable'")
            }

            if(stdout){console.log("sqlmap STDOUT "+stdout)}
        })

        await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));
    }
  }
}
