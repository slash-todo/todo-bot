# Commands

This plugin manages all registered commands using its public API. A command starts with `!` e.g. `!commands`

## Public API

The plugin exposes a public API to be used by other plugins

- `registerCommand(command: string, description: string, callback: (message) => void)`

## Configuration

The plugin does not support any kind of configuration

## Registered Commands

The plugin itself registers the command `!commands` which returns all available commands

**Example Output**

```
Available Commands:

!commands - Lists all available commands
!remindme - Allows you to get reminded by the bot
```
