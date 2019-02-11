const { MessageTypes, DiscordUtils } = require('../../shared');
const { Logger } = require('../../shared');

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
      return Promise.reject(
        new Error('EmojiReactions: No discord client provided!')
      );
    }
    if (!action) {
      return Promise.reject(new Error('EmojiReactions: No action provided!'));
    }

    options.emojis =
      options.hasOwnProperty('emojis') && Array.isArray(options.emojis)
        ? options.emojis
        : [];

    return Promise.resolve(reactionParams);
  }

  function init(reactionParams) {
    const { client, options } = reactionParams;

    function addInitialEmojis(message, options) {
      if (message && options && options.hasOwnProperty('emojis')) {
        options.emojis.forEach(e => message.react(e));
      }

      return Promise.resolve(message);
    }

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

    DiscordUtils.fetchMessageByChannel(options.messageId, options.channelId)
      .then(message => addInitialEmojis(message, options))
      .then(setupReactionsListeners)
      .catch(error => {
        const errorMsg = error instanceof Error ? error.message : error;
        Logger.error(errorMsg);
      });
  }

  const reactionParams = new EmojiReactionsParams(client, action, options);
  validateParams(reactionParams)
    .then(init)
    .catch(Logger.error);
}

module.exports = EmojiReactions;
