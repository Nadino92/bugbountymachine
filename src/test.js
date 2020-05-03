var util = require('./utils.js')

var proc = require('child_process')

var acceptedRisk = ["High","Medium"]

console.log("start")

var stdout2 = "acasa"

proc.execSync("python3 $BBDIR/src/attack/zap.py https://dk.ciao.com", {maxBuffer: 100*1024*1024}, async (error, stdout, stderr) => {
  if (error) {
      util.debug(`error: ${error.message}`)
      //we will log what happened
      return
  }

  stdout2=stdout

  console.log("qualcosa "+stderr+" " +stdout+" "+ error)

  util.debug("ZAP STDOUT '"+stdout+"'")

  var obj = JSON.parse(stdout)

  for(var i=0; i < obj.length; i++){
    var alert = obj[i]

    if(acceptedRisk.includes(alert.risk)){
      util.debug("FOUND!!! "+alert.risk+" bug => "+alert.alert+" on "+alert.url)
    }
  }
})

console.log(stdout2)
