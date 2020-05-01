var cons = require('./constants.js')
var util = require('./utils.js')
var amass = require('./recon/amass.js')

var args = process.argv.slice(2)

async function recon(domain){
  await amass.recon(domain)

  util.debug("Recon concluded")

  util.debug("Attack started")

}

if(args.length > 0){
  var domain = args[0]
  util.debug("Engine started for "+domain)
  recon(domain)
}


/*module.exports.start = function(domain) {
  var promise = new Promise(function(resolve, reject){
    util.debug("Started amass for "+domain)
    var res = amass.recon(domain)
    util.debug("Result => "+res)

    if(res){
      resolve("Success!")
    } else {
      reject("Error!")
    }
  })
}*/
