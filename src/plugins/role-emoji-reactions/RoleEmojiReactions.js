const Utils = require("../../shared/Utils");

const EmojiReaction = Utils.requireDependency("../emoji-reactions");

const initialOptions = {
  channel: "",
  messageId: "",
  rules: {
    emojiName: "role",
    emojiName2: "role2"
  }
};

function RoleEmojiReactions(client, options) {
  function assignRole() {}

  function init() {
    const emojiReactions = new EmojiReaction(client, options, assignRole);
  }

  init();
}

module.exports = RoleEmojiReactions;
