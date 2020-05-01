module.exports = {
  debug: true,
  maxQueue: 4,
  logs : "./logs/logs.txt",

  //database
  dbName: "test",
  dbDomain: "domain",
  dbAlert: "alert",
  dbVuln: "vulnerability",

  //slack
  channelErrors: "errors",

  alertError: "@alert New error detected while executing command ",

  urlSlackMessage: "https://slack.com/api/chat.postMessage",

  //cmd
  cmdAmass: "amass enum --passive -d ",
  cmdHttprobe: "httprobe",
}
