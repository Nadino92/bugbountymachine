var cmd = require('./recon/amass.js')
var gau = require('./recon/gau.js')
var util =require ('./utils.js')

async function x(){
var proc = require("child_process").spawn("google-chrome ",["\"https://hello.com/<script>alert(1)</script>\""])

proc.on('error', function(err){console.log(err)})

await new Promise(resolve => setTimeout(resolve, 5000));

proc.kill('SIGINT')
}

x()
