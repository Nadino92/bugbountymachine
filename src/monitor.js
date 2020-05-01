var util = require('./utils.js')


module.exports.start = async function(cmd, mins){
    while (true) {
      //trigger every X minutes
      await new Promise(resolve => setTimeout(resolve, mins * 60 * 1000));

      util.exec(cmd)
  }
}
