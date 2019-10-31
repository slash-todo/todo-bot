"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEPENDENCIES = {
    COMMANDS: 'commands'
};
var COMMAND = '!remindme';
var DESCRIPTION = 'Allows you to get reminded by the bot';
function RemindMe(client, options) {
    if (options === void 0) { options = { secondsBetweenRuns: 5 }; }
    var reminders = {}; // key is date/time, value is { user, message }
    var activeInterval = null;
    var commandsPluginApi = client.plugins[DEPENDENCIES.COMMANDS];
    function getTime(firstEntry) {
        try {
            return parseInt(firstEntry);
        }
        catch (error) {
            return false;
        }
    }
    function addReminder(date, author, userMessage, message) {
        if (!activeInterval) {
            activeInterval = setInterval(remind, options.secondsBetweenRuns * 1000);
        }
        reminders[date.getTime()] = {
            user: author,
            userMessage: userMessage,
            originalMessage: message
        };
    }
    /* !remindme 1 minute "What are you doing" */
    /* Notice: @User "What are you doing" - link to remindme - private DM */
    function remindMeHandler(message) {
        var now = new Date();
        var ddmmyyRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
        var content = message.content;
        var msgText = content.substring(content.indexOf('"') + 1, content.lastIndexOf('"'));
        var msg = content.substring(COMMAND.length + 1);
        var separatedMsg = msg.split(' ');
        if (ddmmyyRegex.test(separatedMsg[0])) {
            // is date
            var date = new Date(separatedMsg[0]);
            addReminder(date, message.author, msgText, message);
        }
        else {
            var time = getTime(separatedMsg[0]);
            if (time) {
                var unit = separatedMsg[1];
                var multipler = 1;
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
                var timeToRemind = time * multipler;
                var date = new Date(now.getTime() + timeToRemind);
                addReminder(date, message.author, msgText, message);
            }
        }
    }
    function createDM(reminder) {
        return "\n" + reminder.userMessage + "\n" + reminder.originalMessage.url + "\n    ";
    }
    function remind() {
        var now = new Date();
        var past = {};
        var future = {};
        Object.entries(reminders).forEach(function (_a) {
            var timestamp = _a[0], data = _a[1];
            timestamp <= now.getTime()
                ? (past[timestamp] = data)
                : (future[timestamp] = data);
        });
        Object.values(past).forEach(function (r) {
            return r.originalMessage.author.send(createDM(r));
        });
        if (Object.keys(future).length <= 0 && !!activeInterval) {
            clearInterval(activeInterval);
            activeInterval = null;
        }
        reminders = future;
    }
    commandsPluginApi.registerCommand(COMMAND, DESCRIPTION, remindMeHandler);
}
exports.RemindMe = RemindMe;
