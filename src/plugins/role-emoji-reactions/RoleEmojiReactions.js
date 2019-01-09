const EmojiReaction = require('../emoji-reactions');

// Default options to illustrate shape
/* const initialOptions = {
  channel: '',
  messageId: '',
  rules: {
    emojiName: 'role',
    emojiName2: 'role2'
  }
};*/

function RoleEmojiReactionsParams(client, options) {
  this.client = client;
  this.options = options;
}

function RoleEmojiReactions(client, options) {
  function validateParams(reactionParams) {
    const { client } = reactionParams;

    if (!client) {
      throw new Error('RoleEmojiReactions: No discord client provided!');
    }

    return Promise.resolve(reactionParams);
  }

  function handleReaction(emoji, user) {
    function assignRole(user, role) {
      if (!user.roles.some(r => r.name === role)) {
        user.addRole(role);
      }
    }

    assignRole(user, options.rules[emoji]);
  }

  function init(reactionParams) {
    const { client, options } = reactionParams;
    new EmojiReaction(client, handleReaction, options);
  }

  const params = new RoleEmojiReactionsParams(client, options);
  validateParams(params).then(init);
}

module.exports = RoleEmojiReactions;
