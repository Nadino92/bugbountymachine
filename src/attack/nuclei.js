var util = require('../utils.js')
var slack = require('../alert/slack.js')

var proc = require('child_process')

var templates = [
      "cves/*.yaml",
      "subdomain-takeover/*.yaml",
      "vulnerabilities/*.yaml",
      "security-misconfiguration/*.yaml",
      "files/*.yaml"
      ]

module.exports.start = function(file){
  util.debug("Nuclei for "+file)

  templates.forEach(item => {
    var cmd = "cd $BBDIR/tmp; nuclei -silent -t \"$BBDIR/nuclei-templates/"+item+"\" -l "+file

    util.debug("CMD nuclei "+cmd)

    proc.execSync(cmd, (error, stdout, stderr) => {
      if(stdout) {
        util.debug("NUCLEIIIIIIIIIIIIIIIIIII")
        slack.sendNuclei(stdout)
      }
    })
  })
}
