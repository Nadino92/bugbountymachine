var util = require('./src/utils.js')
var cons = require('./src/constants.js')
var engine = require('./src/engine.js')

fs = require('fs')
const {spawn} = require('child_process')

lr = require('line-reader')

try{
  fs.unlink(cons.logs, function(err){
    //nada
  })
} catch (e) {
  fs.open(cons.logs, 'w',function(err){if(err) throw err;})
}


var queue = []

async function start(){
  var engineQueue = 0

  while(queue.length > 0 || engineQueue > 0){
    util.debug(JSON.stringify(queue) + " # in queue "+engineQueue )

    if(engineQueue < cons.maxQueue && queue.length > 0){
      var domain = queue.pop()
      util.debug("Analyzing "+domain)

      var proc = spawn("node",["src/engine.js",domain])

      proc.on('exit', function(code, signal){
        util.debug('child process exited with '+code+" and signal "+signal)
        engineQueue--
      })
      engineQueue++
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  util.debug("FINISH")
}

//fetch all inscope domains
lr.eachLine('./inscope.txt', function(line, last){
  util.debug("Adding "+line+" to queue")

  queue.push(line)

  if(last) {start()}
})
