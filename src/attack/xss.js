var cons = require('../constants.js')
var util = require('../utils.js')

var lr = require('line-reader')

module.exports.test = function(file){
  lr.eachLine(file, function(url, last){
    const q = new URL(url)

    util.exec("google-chrome "+url+"/<script>alert(1)</script>")

  })
}
