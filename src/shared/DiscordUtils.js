const client = require('./DiscordClient');

function fetchMessageByChannel(messageId, channelId) {
  const channel = client.channels.find(c => c.id === channelId);

  if (!channel) {
    return Promise.resolve(null);
  }

  return channel.fetchMessage(messageId);
}

module.exports = {
  fetchMessageByChannel
};
