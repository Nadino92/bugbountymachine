var cmd = require('./recon/amass.js')
var gau = require('./recon/gau.js')
var util =require ('./utils.js')
var url = require('url')
var path = require('path')

var proc = require("child_process")

q = url.parse("https://cazzp.cpm/inde.html?hello=1")

var failed = false
try{
proc.execSync("python3 $BBDIR/sqlmap-dev/sqlmap.py --timeout 2 --batch -u 'https://hello.com/?u=1' | grep 'do not appear to be inajectable'", async (error, stdout, stderr) => {
    if (error) {
        //console.log(`error: ${error.message}`);
        //util.sendError(error.message, "sqlmap --batch -u "+item.href+" | grep 'might be injectable'")
    }

    if(stdout){console.log("sqlmap STDOUT "+stdout)}
})}
catch(err) {failed=true}

if(failed) {console.log("gg")}
