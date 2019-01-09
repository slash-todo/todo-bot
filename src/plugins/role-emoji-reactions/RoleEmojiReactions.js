const EmojiReaction = require('../emoji-reactions');
const { Logger, PermissionTypes, MessageTypes } = require('../../shared');

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

  function handleReaction(emoji, user, actionType) {
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

    function getRoleByName(name) {
      return relevantRoles.find(role => role.name === name);
    }

    function toggleRole(user, roleName, actionType) {
      function hasBotPermissions() {
        if (!guild.me.permissions.has(PermissionTypes.MANAGE_ROLES)) {
          Logger.error(
            `The bot doesn't have the ${
              PermissionTypes.MANAGE_ROLES
            } permission!`
          );
          return false;
        }
        return true;
      }

      function shouldAddRole(actionType, member, roleName) {
        return (
          actionType === MessageTypes.MESSAGE_REACTION_ADD &&
          !hasRole(member, roleName)
        );
      }

      function shouldRemoveRole(actionType, member, roleName) {
        return (
          actionType === MessageTypes.MESSAGE_REACTION_REMOVE &&
          hasRole(member, roleName)
        );
      }

      function addRole(member, role) {
        Logger.info(
          `Add role '${role.name}' to user '${member.user.username}'`
        );
        member.addRole(role).catch(error => {
          Logger.error(`Error while adding role: ${error}`);
        });
      }

      function removeRole(member, role) {
        Logger.info(
          `Remove role '${role.name}' from user '${member.user.username}'`
        );
        member.removeRole(role).catch(error => {
          Logger.error(`Error while removing role: ${error}`);
        });
      }

      const member = getMemberById(user.id);
      const role = getRoleByName(roleName);

      if (member && hasBotPermissions()) {
        if (shouldAddRole(actionType, member, roleName)) {
          addRole(member, role);
        } else if (shouldRemoveRole(actionType, member, roleName)) {
          removeRole(member, role);
        }
      }
    }

    toggleRole(user, options.rules[emoji], actionType);
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
