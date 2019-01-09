const config = require('./config.json');

const { Logger } = require('./shared');
const DiscordClient = require('./shared/DiscordClient');

function TodoBot(plugins) {
  const client = DiscordClient;

  function initClient() {
    client.on('error', e => Logger.error(e));
    client.on('warn', e => Logger.warn(e));
    client.on('debug', e => Logger.debug(e));
    return Promise.resolve(true);
  }

  function connectToDiscord() {
    Logger.info('Connecting to Discord...');
    function handleReady(resolve) {
      client.removeListener('ready', handleReady);
      Logger.info('Successfully connected to Discord!');
      resolve();
    }

    return new Promise(resolve => {
      client.on('ready', () => handleReady(resolve));
    });
  }

  function initPlugins(plugins) {
    Logger.info('Initializing plugins...');
    plugins.forEach(plugin => {
      require(`./plugins/${plugin.name}`)(DiscordClient, {
        ...plugin.options,
        server: config.server.id
      });
    });
    Logger.info('Successfully loaded plugins!');
    return Promise.resolve(true);
  }

  Logger.info('Starting TodoBot...');
  initClient()
    .then(connectToDiscord)
    .then(() => initPlugins(plugins))
    .then(() => Logger.info('TodoBot is now running!'));
}

module.exports = TodoBot;
