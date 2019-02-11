# todo-bot
This is a Node.js bot for use in the //Todo discord server.

## Commands:

Todo: fill in commands   

## Currently available Plugins

 - **RoleEmojiReactions** - automatically assigns discord roles based on specified emoji reactions

## Install
The following steps are necessary to install and run the bot.

 1) Clone the repository - ` git clone https://github.com/slash-todo/todo-bot`
 2) Install dependencies - `npm install`
 3) Obtain a token from [Discord's developer portal](https://discordapp.com/developers) and set it as environment variable `DISCORD_TOKEN`
 4) Configure the bot inside the `config.json`
 5) Run the bot - `npm start`

## Development
The bot is structured using a rudimentary plugin system. To extend the functionality add a plugin and tell the bot to load it.

### Write a Plugin
A plugin exports a simple function taking the initialized Discord client and some plugin specific options as parameters.

```javascript
module.exports = function MyPlugin(discordClient, myPluginOptions) {
    // perform plugin duties
}
```

During initialization of the bot the plugin gets loaded, the global Discord client and the options configured in `config.json` get passed to the plugin. The passed in client is an instance of [discord.js](https://discord.js.org/#/).


