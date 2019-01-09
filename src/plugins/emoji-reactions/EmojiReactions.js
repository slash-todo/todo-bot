const MessageTypes = require('../../shared/MessageTypes');

// Default options mean reactions are captured for all new messages after the bot was enabled
const initialOptions = {
  channel: '',
  messageId: '',
  emojis: [] // list of relevant emojis
};

// Outlines the signature of an action
// const defaultAction = (emoji, user) => {};

function EmojiReactionsParams(client, action, options) {
  this.client = client;
  this.action = action;
  this.options = options;
}

function EmojiReactions(client, action, options = initialOptions) {
  function validateParams(reactionParams) {
    const { client, action, options } = reactionParams;

    if (!client) {
      throw new Error('EmojiReactions: No discord client provided!');
    }
    if (!action) {
      throw new Error('EmojiReactions: No action provided!');
    }

    options.emojis =
      options.hasOwnProperty('emojis') && Array.isArray(options.emojis)
        ? options.emojis
        : [];

    return Promise.resolve(reactionParams);
  }

  function init(reactionParams) {
    const { client, options } = reactionParams;

    function fetchMessage() {
      const channel = client.channels.find(c => c.id === options.channel);

      if (channel) {
        return channel.fetchMessage(options.messageId);
      }
    }

    function setupReactionsListener(message) {
      function handleReaction(reaction) {
        if (reaction) {
          action(reaction.emoji.name, reaction.users.last());
        }
      }

      if (message) {
        client.on(MessageTypes.MESSAGE_REACTION_ADD, reaction => {
          if (reaction.message.id === message.id) {
            handleReaction(reaction);
          }
        });
      }
    }

    fetchMessage().then(setupReactionsListener);

    //client.on(MessageTypes.MESSAGE_REACTION_ADD, handleMessageReactionAdd);
  }

  const reactionParams = new EmojiReactionsParams(client, action, options);
  validateParams(reactionParams).then(init);
}

module.exports = EmojiReactions;
