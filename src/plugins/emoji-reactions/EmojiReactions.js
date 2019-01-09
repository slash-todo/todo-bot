const { MessageTypes, DiscordUtils } = require('../../shared');

// Default options mean reactions are captured for all new messages after the bot was enabled
const initialOptions = {
  channelId: '',
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

    function setupReactionsListeners(message) {
      function processReaction(context, reaction, user) {
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
        const {
          MESSAGE_REACTION_ADD: ADD,
          MESSAGE_REACTION_REMOVE: REMOVE
        } = MessageTypes;

        client.on(
          ADD,
          processReaction.bind(this, { message, actionType: ADD })
        );

        client.on(
          REMOVE,
          processReaction.bind(this, {
            message,
            actionType: REMOVE
          })
        );
      }

      if (message) {
        setupHandlers(message);
      }
    }

    DiscordUtils.fetchMessageByChannel(
      options.messageId,
      options.channelId
    ).then(setupReactionsListeners);
  }

  const reactionParams = new EmojiReactionsParams(client, action, options);
  validateParams(reactionParams).then(init);
}

module.exports = EmojiReactions;
