# RemindMe

**Disclaimer: This plugin is still in development**

The plugin allows the user to get reminded by the bot at a specified time

## Configuration

The configuration requires one property

- `secondsBetweenRuns: number` - defines how often the plugin should check if there are registered Reminders

## How to use it

There will be multiple ways on how to use it, currently the only tested command looks like this

- `!remindme 10 seconds "Remind me in 10 seconds"`

Other supported commands

- `!remindme 10 minutes "Remind me in 10 minutes"`
- `!remindme 10 hours "Remind me in 10 hours"`
- `!remindme 1 day "Remind me in 1 day"`
- `!remindme 5 weeks "Remind me in 5 weeks"`
- `!remindme 1 month "Remind me in 1 month"`
- `!remindme 2 years "Remind me in 2 years"`
- `!remindme 14.12.2019 "Remind me on the 14th of December 2019, 12:00 GMT"`

The bot reminds the user by sending them a private message with the registered text and a link to the original message.

## Development

This Plugin is written in Typescript
