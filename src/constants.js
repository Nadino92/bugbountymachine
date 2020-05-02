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
  channelSqli: "sqli",
  channelNuclei: "nuclei-general",

  alertError: "New error detected while executing command ",
  alertSqli: "SQL injection found at ",
  alertNuclei: "Nuclei found something at ",

  urlSlackMessage: "https://slack.com/api/chat.postMessage",

  //cmd
  cmdAmass: "amass enum --passive -d ",
  cmdHttprobe: "httprobe --prefer-https",

  //color terminal
  colorRed : "\x1b[31m",
  colorWhite : "\x1b[37m",
  colorGreen: "\x1b[32m",
  colorYellow: "\x1b[33m"
}
