"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEPENDENCIES = {
    COMMANDS: 'commands'
};
var COMMAND = '!afk';
var DESCRIPTION = 'Allows a user to set an afk message. The message is deleted when the user sends another message or uses \'!afk back\'';
function Afk(client) {
    var afkRegistrations = {};
    var commandsPluginApi = client.plugins[DEPENDENCIES.COMMANDS];
    function getAfkUsers(message) {
        return message.mentions.members
            .filter(function (m) { return Object.keys(afkRegistrations).includes(m.user.username); })
            .array();
    }
    function registerReactionListener() {
        function clearIfAfk(message) {
            if (Object.keys(afkRegistrations).some(function (username) { return username === message.author.username; })) {
                delete afkRegistrations[message.author.username];
                return true;
            }
            return false;
        }
        function postResponse(message, registrations) {
            var msgText = Object.entries(registrations)
                .map(function (_a) {
                var username = _a[0], text = _a[1];
                return username.trim() + " is afk: " + text;
            })
                .join('\n');
            message.channel.send("<@" + message.author.id + "> " + msgText);
        }
        client.on('message', function messageHandler(message) {
            function isCommand(message) {
                return message.content.trim().startsWith(COMMAND);
            }
            function byAfkUsers(afkUsers, _a) {
                var username = _a[0], value = _a[1];
                return afkUsers.map(function (u) { return u.user.username; }).includes(username);
            }
            function toAfkRegistration(_a) {
                var _b;
                var username = _a[0], value = _a[1];
                return _b = {}, _b[username] = value, _b;
            }
            if (isCommand(message)) {
                return;
            }
            var cleared = clearIfAfk(message);
            if (!cleared) {
                var afkUsers_1 = getAfkUsers(message);
                if (afkUsers_1.length > 0) {
                    postResponse(message, Object.entries(afkRegistrations)
                        .filter(function (values) { return byAfkUsers(afkUsers_1, values); })
                        .map(toAfkRegistration)
                        .reduce(function (regs, current) {
                        return Object.assign(regs, current);
                    }));
                }
            }
        });
    }
    function afkRegistrationHandler(message) {
        var content = message.content.substr(4).trim();
        if (content === 'back') {
            delete afkRegistrations[message.author.username];
            return;
        }
        afkRegistrations[message.author.username] = message.content.substr(4);
    }
    commandsPluginApi.registerCommand(COMMAND, DESCRIPTION, afkRegistrationHandler);
    registerReactionListener();
}
exports.Afk = Afk;
