var cons = require('./constants.js')
var slack = require('./alert/slack.js')

var fs = require('fs')

module.exports.debug = function(msg){
  if(cons.debug){
    console.log(msg+"\n\n");
    fs.appendFile(cons.logs, msg+"\n\n", function(err){
      if(err) throw err;
    })
  }
}

function statusHandler(error, stderr, stdout){
  if (error) {
      debug(`error: ${error.message}`);
      slack.sendError(error.message, cmd)
      //we will log what happened
      return false;
  }
  if (stderr) {
      debug(`stderr: ${stderr}`);
      //slack.sendError(stderr, cmd)
      //we will log the failure at runtime
      return true;
  }

  //we will capture stdout and process it
  debug(`stdout: ${stdout}`);
  return true
}

module.exports.exec = function(cmd){
  const { exec } = require("child_process");


  exec(cmd, (error, stdout, stderr) => {
      return statusHandler(error, stderr, stdout)
  });
}

module.exports.execSync = function(cmd){
  const { execSync } = require("child_process");


  execSync(cmd, (error, stdout, stderr) => {
      return statusHandler(error, stderr, stdout)
  });
}
