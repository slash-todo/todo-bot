# Announcements

The plugin sends a message when a user joins, leaves or gets banned

## Configuration
The `channelId` defines the channel in which the messages are posted. All other properties are optional.

```json
{
  "announcements": {
    "channelId": "",
    "join": "Hi {user}, welcome to the server!",
    "leave": "{user} just left the server!",
    "ban": "{user} just got banned!"
  }
}
```

## Variables
The message templates support a some variables

- `{user}: The username of the member that triggered the action`

## Development
This Plugin is written in Typescript
