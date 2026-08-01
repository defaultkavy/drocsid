import { type APIAutocompleteApplicationCommandInteractionData, type APIChatInputApplicationCommandInteractionData, ApplicationCommandOptionType, ApplicationCommandType, InteractionType } from "discord-api-types/payloads";
import type { RESTPutAPIApplicationCommandsJSONBody, RESTPutAPIApplicationGuildCommandsJSONBody } from "discord-api-types/rest";
import { ChatCommandEvent } from "../event/ChatCommandEvent";
import { UserCommandEvent } from "../event/UserCommandEvent";
import { ChatCommandBuilder, ChatCommandBuilderBase, SubcommandBuilder } from "./ChatCommandBuilder";
import { CommandBuilder } from "./CommandBuilder";
import { MessageCommandBuilder } from "./MessageCommandBuilder";
import type { UserCommandBuilder } from "./UserCommandBuilder";
import { Discord } from "../..";
import { AutocompleteEvent } from "../event/AutocompleteEvent";
import { loggerMap } from "../lib/logger";
import { MessageCommandEvent } from "../event/MessageCommandEvent";

const logger = loggerMap.builder;

export class CommandsBuilder {
    guildCommands = new Set<CommandBuilder>();
    globalCommands = new Set<CommandBuilder>();
    commands = new Map<string, CommandBuilder>();

    addGuildCommand(command: CommandBuilder) {
        this.guildCommands.add(command);
        if (command instanceof ChatCommandBuilder) this.registerChatCommands(command);
        else this.commands.set(command.config.name, command)
        return this;
    }

    addGlobalCommand(command: CommandBuilder) {
        this.globalCommands.add(command);
        if (command instanceof ChatCommandBuilder) this.registerChatCommands(command);
        else this.commands.set(command.config.name, command)
        return this;
    }

    listen(client: Discord.Client) {
        const log = logger.prefix('listen()')
        client.on('InteractionCreate', ({data}) => {
            if (data.type === InteractionType.ApplicationCommand) {
                const i_cmd = data.data;
                switch (i_cmd.type) {
                    case ApplicationCommandType.ChatInput: {
                        const name = this.commandMapKey(i_cmd);
                        log.debug('chat input command:', name);
                        const cmd = this.commands.get(name) as ChatCommandBuilderBase;
                        cmd?.listeners.forEach(dispatcher => dispatcher(new ChatCommandEvent(client, data as any, i_cmd.options)))
                        break;
                    }
                    case ApplicationCommandType.Message: {
                        const cmd = this.commands.get(data.data.name) as MessageCommandBuilder;
                        log.debug('message command:', data.data.name);
                        cmd?.listeners.forEach(dispatcher => dispatcher(new MessageCommandEvent(client, data as any)))
                        break;
                    }
                    case ApplicationCommandType.User: {
                        const cmd = this.commands.get(data.data.name) as UserCommandBuilder;
                        log.debug('user command:', data.data.name);
                        cmd?.listeners.forEach(dispatcher => dispatcher(new UserCommandEvent(client, data as any)))
                        break;
                    }
                }
            }

            else if (data.type === InteractionType.ApplicationCommandAutocomplete) {
                const name = this.commandMapKey(data.data);
                const cmd = this.commands.get(name) as ChatCommandBuilderBase;
                cmd.autocompleteListeners.forEach(dispatcher => dispatcher(new AutocompleteEvent(client, data)))
            }
        })
        return this;
    }

    async deployGuildCommand(client: Discord.Client, guildId: string) {
        return client.application().guild(guildId).commands.bulkOverwrite(Array.from(this.guildCommands).map(cmd => cmd.config) as RESTPutAPIApplicationGuildCommandsJSONBody)
    }

    async deployGlobalCommand(client: Discord.Client) {
        return client.application().commands.bulkOverwrite(Array.from(this.globalCommands).map(cmd => cmd.config) as RESTPutAPIApplicationCommandsJSONBody)
    }

    private commandMapKey(i: APIChatInputApplicationCommandInteractionData | APIAutocompleteApplicationCommandInteractionData): string {
        const resolveOptionNames = (options: CommandOption[] | undefined): string[] => {
            if (!options) return [];
            const [first] = options;
            if (!first) return [];
            if (first.type !== ApplicationCommandOptionType.Subcommand && first.type !== ApplicationCommandOptionType.SubcommandGroup) return [];
            return [first.name, ...resolveOptionNames(first.options)];
        }
        return [i.name, ...resolveOptionNames(i.options)].join(':');
    }

    private registerChatCommands(builder: ChatCommandBuilder) {
        if (builder.subcommands.size === 0) this.commands.set(builder.config.name, builder);
        else builder.subcommands.forEach(subcmd => {
            if (subcmd instanceof SubcommandBuilder) this.commands.set([builder.config.name, subcmd.config.name].join(':'), subcmd);
            else {
                subcmd.subcommands.forEach(subcmd2 => {
                    this.commands.set([builder.config.name, subcmd.config.name, subcmd2.config.name].join(':'), subcmd2)
                })
            }
        })
    }
}

type CommandOption = { type: ApplicationCommandOptionType, name: string, options?: CommandOption[] }
