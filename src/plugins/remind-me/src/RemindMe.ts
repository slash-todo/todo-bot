import { Client, Message, User } from 'discord.js';

interface RemindMeOptions {
  secondsBetweenRuns: number;
}

interface Reminder {
  user: User;
  userMessage: string;
  originalMessage: Message;
}

interface Reminders {
  // timestamp
  [date: number]: Reminder;
}

interface ExtendedClient extends Client {
  plugins: any;
}

const DEPENDENCIES = {
  COMMANDS: 'commands'
};
const COMMAND = '!remindme';
const DESCRIPTION = 'Allows you to get reminded by the bot';

export function RemindMe(
  client: ExtendedClient,
  options: RemindMeOptions = { secondsBetweenRuns: 5 }
) {
  let reminders: Reminders = {}; // key is date/time, value is { user, message }
  let activeInterval: NodeJS.Timeout | null = null;
  const commandsPluginApi = client.plugins[DEPENDENCIES.COMMANDS];

  function getTime(firstEntry: string) {
    try {
      return parseInt(firstEntry);
    } catch (error) {
      return false;
    }
  }

  function addReminder(
    date: Date,
    author: User,
    userMessage: string,
    message: Message
  ) {
    if (!activeInterval) {
      activeInterval = setInterval(remind, options.secondsBetweenRuns * 1000);
    }
    reminders[date.getTime()] = {
      user: author,
      userMessage,
      originalMessage: message
    };
  }

  /* !remindme 1 minute "What are you doing" */
  /* Notice: @User "What are you doing" - link to remindme - private DM */
  function remindMeHandler(message: Message) {
    const now = new Date();
    const ddmmyyRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    const content = message.content;
    let msgText = content.substring(
      content.indexOf('"') + 1,
      content.lastIndexOf('"')
    );
    let msg = content.substring(COMMAND.length + 1);
    let separatedMsg = msg.split(' ');

    if (ddmmyyRegex.test(separatedMsg[0])) {
      // is date
      const date = new Date(separatedMsg[0]);
      addReminder(date, message.author, msgText, message);
    } else {
      const time = getTime(separatedMsg[0]);
      if (time) {
        const unit = separatedMsg[1];
        let multipler = 1;
        switch (unit.toLowerCase()) {
          case 'second':
          case 'seconds':
            multipler = 1000;
            break;
          case 'minute':
          case 'minutes':
            multipler = 60 * 1000;
            break;
          case 'hour':
          case 'hours':
            multipler = 60 * 60 * 1000;
            break;
          case 'day':
          case 'days':
            multipler = 24 * 60 * 60 * 1000;
            break;
          case 'week':
          case 'weeks':
            multipler = 7 * 24 * 60 * 60 * 1000;
            break;
          case 'month':
          case 'months':
            multipler = 30 * 7 * 24 * 60 * 60 * 1000;
            break;
          case 'year':
          case 'years':
            multipler = 365 * 24 * 60 * 60 * 1000;
            break;
          default:
            break;
        }

        const timeToRemind: number = time * multipler;
        const date = new Date(now.getTime() + timeToRemind);
        addReminder(date, message.author, msgText, message);
      }
    }
  }

  function createDM(reminder: Reminder) {
    return `
${reminder.userMessage}
${reminder.originalMessage.url}
    `;
  }

  function remind() {
    const now = new Date();
    const past: Reminders = {};
    const future: Reminders = {};

    Object.entries(reminders).forEach(([timestamp, data]: any) => {
      timestamp <= now.getTime()
        ? (past[timestamp] = data)
        : (future[timestamp] = data);
    });

    Object.values(past).forEach((r: Reminder) =>
      r.originalMessage.author.send(createDM(r))
    );

    if (Object.keys(future).length <= 0 && !!activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }

    reminders = future;
  }

  commandsPluginApi.registerCommand(COMMAND, DESCRIPTION, remindMeHandler);
}
