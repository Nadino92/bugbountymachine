var cmd = require('./recon/amass.js')
var gau = require('./recon/gau.js')
var util =require ('./utils.js')
var url = require('url')

var proc = require("child_process")

q = url.parse("https://cazzp.cpm/?hello=1")

proc.exec("python3 $BBDIR/sqlmap-dev/sqlmap.py --batch -u "+q.href+" | grep 'might be injectable'", async (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return
    }

    if(stdout){console.log("sqlmap STDOUT "+stdout)}
})
