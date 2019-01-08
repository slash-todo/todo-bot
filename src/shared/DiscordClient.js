const Discord = require("discord.js");

function getDiscordClient() {
  return new Discord.Client();
}

function login(client) {
  client.login("NDY2NTE3ODYxMjAwODIyMjc1.Die_5Q.BOI591c5kETTqOJSS3cJUXaf-vg");
}

let client = getDiscordClient();
login(client);

module.exports = client;
