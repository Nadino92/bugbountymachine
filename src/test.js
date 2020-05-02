var cmd = require('./recon/amass.js')
var gau = require('./recon/gau.js')
var util =require ('./utils.js')
var url = require('url')
var path = require('path')

var proc = require("child_process")

q = url.parse("https://cazzp.cpm/inde.html?hello=1")

console.log(path.extname(q.pathname).endsWith("html"))
