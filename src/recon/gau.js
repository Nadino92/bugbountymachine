var cons = require('../constants.js')
var util = require('../utils.js')
var db = require('../db/db.js')

module.exports.retrieveUrls = function(domain){
  util.debug("Retrieve allurls of "+domain)

  var res = util.execSync("gau '"+domain+"' 1> x 2> /dev/null")

  util.debug(res)

  util.debug("URLS received")

  return res

}
