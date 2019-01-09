const Discord = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

function getDiscordClient() {
  return new Discord.Client();
}

function login(client) {
  client.login(DISCORD_TOKEN);
}

const client = getDiscordClient();
login(client);

module.exports = client;
