function Commands(client) {
  const registeredCommands = {};

  function registerCommand(command, description, callback) {
    function messageHandler(message) {
      if (message && message.content && message.content.startsWith(command)) {
        callback(message);
      }
    }

    client.on('message', messageHandler);
    registeredCommands[command] = description;
  }

  registerCommand('!commands', 'Lists all available commands', function(
    message
  ) {
    let commands = [
      'Available Commands: \n',
      ...Object.entries(registeredCommands).map(
        ([key, value]) => `${key} - ${value}`
      )
    ];

    message.channel.send(commands.join('\n'));
  });

  // Public API of Commands
  return {
    registerCommand
  };
}

module.exports = Commands;
