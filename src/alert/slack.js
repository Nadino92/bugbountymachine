var cons = require('../constants.js')

const { WebClient } = require('@slack/web-api');

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID

async function send(channel,msg){
  const res = await web.chat.postMessage({ channel: channel, link_names:true, text: msg });

  // `res` contains information about the posted message
  console.log('Message sent: ', res.ts);
}

module.exports.sendError = function(err,cmd){
  send(cons.channelErrors, cons.alertError+" "+cmd+"\n\n"+err)
}
