const MessageTypes = require("../../shared/MessageTypes");

const initialOptions = {
  channel: "",
  messageId: ""
};

function EmojiReactions(client, options, action) {
  function fetchMessage() {}

  function handleMessageReactionAdd(reaction, user) {
    console.log("Reaction added; current count:", reaction, user.username);
  }

  function init() {
    console.log("Initialize Plugin: Emoji Reactions");
    client.on(MessageTypes.MESSAGE_REACTION_ADD, handleMessageReactionAdd);
  }

  fetchMessage();
  init();
}

module.exports = EmojiReactions;
