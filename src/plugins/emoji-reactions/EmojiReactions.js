const MessageTypes = require('../../shared/MessageTypes');

// Default options mean reactions are captured for all new messages after the bot was enabled
const initialOptions = {
  channel: '',
  messageId: ''
};

// Outlines the signature of an action
const defaultAction = (emoji, user) => {};

function EmojiReactions(client, action, options = initialOptions) {
  function validateParams() {
    if (!client) {
      throw new Error('No discord client provided!');
    }
    if (!action) {
      throw new Error('No action provided!');
    }
  }

  function fetchMessage() {}

  function handleMessageReactionAdd(reaction, user) {
    console.log('Reaction added; current count:', reaction, user.username);
  }

  function init() {
    console.log('Initialize Plugin: Emoji Reactions');
    client.on(MessageTypes.MESSAGE_REACTION_ADD, handleMessageReactionAdd);
  }

  validateParams();
  fetchMessage();
  init();
}

module.exports = EmojiReactions;
