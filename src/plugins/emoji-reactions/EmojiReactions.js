const MessageTypes = require('../../shared/MessageTypes');

const ActionType = {
  ADD: MessageTypes.MESSAGE_REACTION_ADD,
  REMOVE: MessageTypes.MESSAGE_REACTION_REMOVE
};

// Default options mean reactions are captured for all new messages after the bot was enabled
const initialOptions = {
  channel: '',
  messageId: '',
  emojis: [] // list of relevant emojis
};

// Outlines the signature of an action
// const defaultAction = (emoji, user, actiontype) => {};

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
      function processForMessage(context, reaction, user) {
        const { message, actionType } = context;
        function handleReaction(reaction, actionType) {
          if (reaction) {
            action(reaction.emoji.name, user, actionType);
          }
        }
        if (reaction.message.id === message.id) {
          handleReaction(reaction, actionType);
        }
      }

      function setupHandlers(message) {
        client.on(
          MessageTypes.MESSAGE_REACTION_ADD,
          processForMessage.bind(this, { message, actionType: ActionType.ADD })
        );
        client.on(
          MessageTypes.MESSAGE_REACTION_REMOVE,
          processForMessage.bind(this, {
            message,
            actionType: ActionType.REMOVE
          })
        );
      }

      if (message) {
        setupHandlers(message);
      }
    }

    fetchMessage().then(setupReactionsListener);

    //client.on(MessageTypes.MESSAGE_REACTION_ADD, handleMessageReactionAdd);
  }

  const reactionParams = new EmojiReactionsParams(client, action, options);
  validateParams(reactionParams).then(init);
}

module.exports = EmojiReactions;
