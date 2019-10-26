import { Client, Message, User, GuildMember, Guild, Channel } from 'discord.js';

const CHANNEL_ID: string = 'channelId';

interface AnnouncementsOptions {
  channelId?: string;
  join?: string;
  leave?: string;
  ban?: string;
}

interface ExtendedClient extends Client {
  plugins: any;
}

type MessageType = 'guildMemberAdd' | 'guildMemberRemove' | 'guildBanAdd';

const MessageTypes: { [key: string]: string } = {
  JOIN: 'guildMemberAdd',
  LEAVE: 'guildMemberRemove',
  BAN: 'guildBanAdd'
};

const Templates = {
  USER: '{user}'
};

export function Announcements(
  client: ExtendedClient,
  options: AnnouncementsOptions
) {
  let channel: Channel | undefined;

  function throwIfIncompleteChannelId(opts: AnnouncementsOptions) {
    if (
      !opts.hasOwnProperty(CHANNEL_ID) ||
      opts.channelId!.trim().length <= 0
    ) {
      throw new Error(
        `A channel id is required for announcements to be posted in a guild's channel!`
      );
    }
  }

  function throwIfChannelNotAvailable() {
    if (!channel) {
      throw new Error(
        `A channel with the id '${options.channelId}' could not be found!`
      );
    }
  }

  function registerAnnouncement(type: MessageType, template: string) {
    function postMessage(username: string) {
      const msg: string = template.replace(Templates.USER, username);
      (channel! as Channel & { send: (m: string) => void }).send(msg);
    }

    switch (type) {
      case MessageTypes.JOIN:
      case MessageTypes.LEAVE:
        client.on(type, (member: GuildMember) =>
          postMessage(member.user.username)
        );
        break;
      case MessageTypes.BAN:
        client.on(type, (_: Guild, user: User) => postMessage(user.username));
        break;
      default:
        throw new Error(`Message type ${type} is not supported!`);
    }
  }

  function setup() {
    throwIfIncompleteChannelId(options);
    channel = client.channels.get(options.channelId!);
    throwIfChannelNotAvailable();
    const types = ['join', 'leave', 'ban'];

    Object.keys(options)
      .filter(key => types.indexOf(key) !== -1)
      .forEach(key => {
        const type = MessageTypes[key.toUpperCase()] as MessageType;
        const template = (options as { [key: string]: string })[key];
        registerAnnouncement(type, template);
      });
  }

  setup();
}
