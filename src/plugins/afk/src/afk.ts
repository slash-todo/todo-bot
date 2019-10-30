import { Client, Message, GuildMember } from 'discord.js';

interface ExtendedClient extends Client {
  plugins: any;
}

interface AfkRegistrations {
  [username: string]: string;
}

const DEPENDENCIES = {
  COMMANDS: 'commands'
};
const COMMAND = '!afk';
const DESCRIPTION = 'Allows a user to set an afk message. The message is deleted when the user sends another message or uses \'!afk back\'';

export function Afk(client: ExtendedClient) {
  const afkRegistrations: AfkRegistrations = {};
  const commandsPluginApi = client.plugins[DEPENDENCIES.COMMANDS];

  function getAfkUsers(message: Message): GuildMember[] {
    return message.mentions.members
      .filter(m => Object.keys(afkRegistrations).includes(m.user.username))
      .array();
  }

  function registerReactionListener() {
    function clearIfAfk(message: Message): boolean {
      if (
        Object.keys(afkRegistrations).some(
          username => username === message.author.username
        )
      ) {
        delete afkRegistrations[message.author.username];
        return true;
      }

      return false;
    }

    function postResponse(message: Message, registrations: AfkRegistrations) {
      const msgText = Object.entries(registrations)
        .map(([username, text]: any) => `${username.trim()} is afk: ${text}`)
        .join('\n');

      message.channel.send(`<@${message.author.id}> ${msgText}`);
    }

    client.on('message', function messageHandler(message: Message) {
      function isCommand(message: Message) {
        return message.content.trim().startsWith(COMMAND);
      }

      function byAfkUsers(
        afkUsers: GuildMember[],
        [username, value]: any
      ): boolean {
        return afkUsers.map(u => u.user.username).includes(username);
      }

      function toAfkRegistration([username, value]: any): {
        [username: string]: string;
      } {
        return { [username]: value };
      }
      if (isCommand(message)) {
        return;
      }
      const cleared = clearIfAfk(message);
      if (!cleared) {
        const afkUsers = getAfkUsers(message);

        if (afkUsers.length > 0) {
          postResponse(message, Object.entries(afkRegistrations)
            .filter(values => byAfkUsers(afkUsers, values))
            .map(toAfkRegistration)
            .reduce((regs, current) =>
              Object.assign(regs, current)
            ) as AfkRegistrations);
        }
      }
    });
  }

  function afkRegistrationHandler(message: Message) {
    const content = message.content.substr(4).trim();
    if (content === 'back') {
      delete afkRegistrations[message.author.username];
      return;
    }

    afkRegistrations[message.author.username] = message.content.substr(4);
  }

  commandsPluginApi.registerCommand(
    COMMAND,
    DESCRIPTION,
    afkRegistrationHandler
  );
  registerReactionListener();
}
