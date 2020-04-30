var cons = require('../constants.js')
var util = require('../utils.js')

lr = require('line-reader')
var child = require('child_process').exec

util.debug("inscope "+cons.inScopeFile)

lr.eachLine('../../inscope.txt', function(line){
  util.debug("line "+line)

  util.exec(cons.cmdAmass+line+" | "+cons.cmdHttprobe+" > $BBDIR/tmp/"+line)
})
