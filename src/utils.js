var cons = require('./constants.js')
var slack = require('./alert/slack.js')

var fs = require('fs')
var lr = require('line-reader')
var urlP = require('url')
var proc = require("child_process");

function debug(msg){
  if(cons.debug){
    console.log(msg+"\n\n");
    fs.appendFile(cons.logs, msg+"\n\n", function(err){
      if(err) throw err;
    })
  }
}

module.exports.debug = function(msg) {
  debug(msg)
}

function sendError(msg, cmd){
  slack.sendError(msg, cmd)
}

function statusHandler(cmd, error, stderr, stdout){
  if (error) {
      console.log(`error: ${error.message}`);
      sendError(error.message, cmd)
      //we will log what happened
      return
  }
}

module.exports.sendError = function(msg, cmd){
  sendError(msg, cmd)
}

module.exports.exec = function(cmd){
  proc.exec(cmd, (error, stdout, stderr) => {
      return statusHandler(cmd, error, stderr, stdout)
  });
}

module.exports.execSync = function(cmd){
  proc.execSync(cmd, (error, stdout, stderr) => {
      return statusHandler(cmd, error, stderr, stdout)
  });
}

module.exports.validUrlScheme = function(gaurls, scheme){
  var set = new Set()

  console.log(gaurls[0]+" s "+scheme)

  for(var i=0; i < gaurls.length; i++){
    var url = gaurls[i]

    if(url.startsWith("http")){
      var q = urlP.parse(url, true)

      if(q.protocol.startsWith(scheme)){
        set.add(q)
      }
    }
  }
  console.log("final set= "+set.size)
  return set
}
