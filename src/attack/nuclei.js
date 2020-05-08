var util = require('../utils.js')
var slack = require('../alert/slack.js')

var proc = require('child_process')

var templatesDomain = [
      //"cves/*.yaml",
      "subdomain-takeover/*.yaml",
      "vulnerabilities/*.yaml",
      "security-misconfiguration/*.yaml",
      "files/*.yaml",
      "panels/*.yaml",
      "tokens/google-api-key.yaml"
      ]

var templatesUrls = [
      "tokens/"
]

module.exports.start = function(file){
  util.debug("Nuclei for "+file)

  templatesDomain.forEach(item => {
    var cmd = "cd $BBDIR/tmp; nuclei -silent -t \"$BBDIR/nuclei-templates/"+item+"\" -l "+file

    util.debug("CMD nuclei "+cmd)

    util.setCheckpoint("nuclei "+file)
    proc.execSync(cmd, (error, stdout, stderr) => {
      console.log(stderr)
      console.log(stdout)
      console.log(error)
      if(stdout) {
        util.debug("NUCLEIIIIIIIIIIIIIIIIIII "+stdout)
        slack.sendNuclei(stdout)
      }
    })
  })
}

module.exports.url = function(urls){

}
