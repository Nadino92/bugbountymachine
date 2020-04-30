var cons = require('./constants.js')

module.exports.debug = function(msg){
  if(cons.debug){
    console.log(msg);
  }
}

module.exports.exec = function(cmd){
  const { exec } = require("child_process");


  exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);

          //we will log what happened
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);

          //we will log the failure at runtime
          return;
      }

      //we will capture stdout and process it
      console.log(`stdout: ${stdout}`);
  });
}

module.exports.execSync = function(cmd){
  const { execSync } = require("child_process");


  execSync(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);

          //we will log what happened
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);

          //we will log the failure at runtime
          return;
      }

      //we will capture stdout and process it
      console.log(`stdout: ${stdout}`);
  });
}
