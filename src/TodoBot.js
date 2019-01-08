const DiscordClient = require("./shared/DiscordClient");

function TodoBot(plugins) {
  function initPlugins(plugins) {
    plugins.forEach(pluginName => {
      require(`./plugins/${pluginName}`)(DiscordClient);
    });
  }

  initPlugins(plugins);
}

module.exports = { TodoBot };
