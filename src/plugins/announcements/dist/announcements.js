"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CHANNEL_ID = 'channelId';
var MessageTypes = {
    JOIN: 'guildMemberAdd',
    LEAVE: 'guildMemberRemove',
    BAN: 'guildBanAdd'
};
var Templates = {
    USER: '{user}'
};
function Announcements(client, options) {
    var channel;
    function throwIfIncompleteChannelId(opts) {
        if (!opts.hasOwnProperty(CHANNEL_ID) ||
            opts.channelId.trim().length <= 0) {
            throw new Error("A channel id is required for announcements to be posted in a guild's channel!");
        }
    }
    function throwIfChannelNotAvailable() {
        if (!channel) {
            throw new Error("A channel with the id '" + options.channelId + "' could not be found!");
        }
    }
    function registerAnnouncement(type, template) {
        function postMessage(username) {
            var msg = template.replace(Templates.USER, username);
            channel.send(msg);
        }
        switch (type) {
            case MessageTypes.JOIN:
            case MessageTypes.LEAVE:
                client.on(type, function (member) {
                    return postMessage(member.user.username);
                });
                break;
            case MessageTypes.BAN:
                client.on(type, function (_, user) { return postMessage(user.username); });
                break;
            default:
                throw new Error("Message type " + type + " is not supported!");
        }
    }
    function setup() {
        throwIfIncompleteChannelId(options);
        channel = client.channels.get(options.channelId);
        throwIfChannelNotAvailable();
        var types = ['join', 'leave', 'ban'];
        Object.keys(options)
            .filter(function (key) { return types.indexOf(key) !== -1; })
            .forEach(function (key) {
            var type = MessageTypes[key.toUpperCase()];
            var template = options[key];
            registerAnnouncement(type, template);
        });
    }
    setup();
}
exports.Announcements = Announcements;
