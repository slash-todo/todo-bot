const EmojiReaction = require('../emoji-reactions');
const { Logger, PermissionTypes } = require('../../shared');

// Default options to illustrate shape
/* const initialOptions = {
  server: 'id'
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
  const guild = client.guilds.get(options.server);
  const relevantRoles = guild.roles.filter(role =>
    Object.values(options.rules).includes(role.name)
  );

  function validateParams(reactionParams) {
    const { client } = reactionParams;

    if (!client) {
      Logger.error('No discord client provided!');
      return;
    }

    return Promise.resolve(reactionParams);
  }

  function handleReaction(emoji, user) {
    function getMemberById(id) {
      let member = null;

      if (guild) {
        const members = Array.from(guild.members.values());
        member = members.find(m => m.user.id === id);
      }

      return member;
    }

    function hasRole(member, role) {
      if (member) {
        return member.roles.some(r => r.name === role);
      }

      return false;
    }

    function assignRole(user, roleName) {
      function getRoleByName(name) {
        return relevantRoles.find(role => role.name === name);
      }

      const member = getMemberById(user.id);
      if (member && !hasRole(member, roleName)) {
        if (!guild.me.permissions.has(PermissionTypes.MANAGE_ROLES)) {
          Logger.error(
            `The bot doesn't have the ${
              PermissionTypes.MANAGE_ROLES
            } permission!`
          );
          return;
        }
        const role = getRoleByName(roleName);
        Logger.info(`Add role '${roleName}' to user '${member.user.username}'`);
        member.addRole(role).catch(error => {
          Logger.error(`Error while adding role: ${error}`);
        });
      }
    }

    assignRole(user, options.rules[emoji]);
  }

  function init(reactionParams) {
    const { client, options } = reactionParams;
    options.emojis = Object.keys(options.rules);
    new EmojiReaction(client, handleReaction, options);
  }

  const params = new RoleEmojiReactionsParams(client, options);
  validateParams(params).then(init);
}

module.exports = RoleEmojiReactions;
