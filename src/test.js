var util = require('./utils.js')

var proc = require('child_process')

var acceptedRisk = ["High","Medium"]

console.log("start")

var stdout2 = "acasa"

var cmd = "echo pwd && nuclei -t \"$BBDIR/nuclei-templates/tokens/*.yaml\" -l $BBDIR/tmp/ciao.com"

util.debug("CMD nuclei "+cmd)

proc.execSync(cmd, (error, stdout, stderr) => {
  console.log(stderr)
  console.log(stdout)
  console.log(error)
  if(stdout) {
    util.debug("NUCLEIIIIIIIIIIIIIIIIIII "+stdout)
    slack.sendNuclei(stdout)
  }
})
