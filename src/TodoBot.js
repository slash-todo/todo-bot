const DiscordClient = require('./shared/DiscordClient');

function TodoBot(plugins) {
  function initPlugins(plugins) {
    plugins.forEach(plugin => {
      require(`./plugins/${plugin.name}`)(DiscordClient, plugin.options);
    });
  }

  initPlugins(plugins);
}

module.exports = { TodoBot };
