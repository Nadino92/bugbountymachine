var util = require('./src/utils.js')
var cons = require('./src/constants.js')
var engine = require('./src/engine.js')
var monitor = require('./src/monitor.js')

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

var start = Date.now()
var queue = []

async function start(){

  //setup processes
  //monitor.start("killall chrome",1)

  //main core
  var engineQueue = 0

  while(queue.length > 0 || engineQueue > 0){
    if(engineQueue < cons.maxQueue && queue.length > 0){
      var domain = queue.pop()
      util.log("Starting thread => "+domain)

      var proc = spawn("node",["src/engine.js",domain])

      proc.on('exit', function(code, signal){
        if(code == 0){
          util.logOk('Process correctly finished')
        } else {
          util.logErr('Process exited with wrong status '+code)
        }
        engineQueue--
        util.log('Remaining to analyze '+queue.length)
        util.log('Queue size '+engineQueue)
      })
      engineQueue++
    }

    await new Promise(resolve => setTimeout(resolve, 60 * 1000));
  }

  util.log("Finish "+new Date(Date.now()-start).getMinutes()+" minutes")
}

//fetch all inscope domains
lr.eachLine('./inscope.txt', function(line, last){
  util.log("New queue element => "+line)

  queue.push(line)

  if(last) {start()}
})
