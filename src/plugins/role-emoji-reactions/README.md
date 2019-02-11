# Role Emoji Reactions

This plugin automatically assigns Discord roles based on specified emoji reactions.

## Configuration

The plugin requires a configuration to be present, bellow is a more detailed look at the properties of the configuration object.

- `channelId: string` - The id of the channel that includes the message the bot should react to
- `messageId: string` - The id of the message the bot should react to
- `rules: object` - An object where each `key` represent and emoji reaction and each value a `role` that should be assigned.

### Example

```json
"role-emoji-reactions": {
    "channelId": "1234567890",
    "messageId": "1234567890",
    "rules": {
        "😉": "Europe",
        "😃": "North America",
        "😂": "South America",
        "😋": "Asia",
        "🤣": "South East Asia",
        "😄": "Africa",
        "😎": "Australia"
    }
}
```

The plugin uses `emoji-reactions` as helper.
