const Plugin = require('./shared/Plugin');
const config = require('./config.json');

const TodoBot = require('./TodoBot');

const plugins = Object.entries(config.plugins).map(
  ([name, options]) => new Plugin(name, options)
);

new TodoBot(plugins);
