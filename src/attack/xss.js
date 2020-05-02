var cons = require('../constants.js')
var util = require('../utils.js')

var lr = require('line-reader')
var proc = require('child_process')

module.exports.test = async function(urls){
  for(let item of urls.keys()) {
    var spawn = proc.spawn("firefox", [item.href])

    await new Promise(resolve => setTimeout(resolve, 5000));

    spawn.kill()
  }
}
