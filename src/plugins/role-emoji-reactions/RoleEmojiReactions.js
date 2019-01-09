const EmojiReaction = require('../emoji-reactions');

// Default options to illustrate shape
const initialOptions = {
  channel: '',
  messageId: '',
  rules: {
    emojiName: 'role',
    emojiName2: 'role2'
  }
};

function RoleEmojiReactions(client, options) {
  function handleReaction(emoji, user) {
    function assignRole(user, role) {}
  }

  function init() {
    new EmojiReaction(client, handleReaction, options);
  }

  init();
}

module.exports = RoleEmojiReactions;
