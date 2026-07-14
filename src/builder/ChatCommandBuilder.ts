import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/rest";
import { APIApplicationCommandIntegerOption, APIApplicationCommandInteractionDataBasicOption, APIApplicationCommandInteractionDataOption, APIApplicationCommandStringOption, APIApplicationCommandSubcommandOption, APIChatInputApplicationCommandInteraction, ApplicationCommandOptionType, InteractionType } from "discord-api-types/payloads";
import { APIApplicationCommandSubcommandGroupOption } from "discord-api-types/v9";
import { CommandBuilder, CommandEvent } from "./CommandBuilder";
import { Discord } from "../structure/Discord";

export abstract class ChatCommandBuilderBase<Options extends Record<string, unknown> = {}> extends CommandBuilder {
    declare options: Options;
    abstract override config: RESTPostAPIChatInputApplicationCommandsJSONBody | APIApplicationCommandSubcommandOption;
    listeners = new Set<(i: ChatCommandEvent<Options>) => void>();

    stringOption<const C extends Omit<APIApplicationCommandStringOption, 'type'>>(config: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.String} as APIApplicationCommandStringOption);
        return this as this & ChatCommandBuilderBase<Options & OptionRequiredPossible<C, string>>;
    }

    integerOption<const C extends Omit<APIApplicationCommandStringOption, 'type'>>(config: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.Integer} as APIApplicationCommandIntegerOption);
        return this as this & ChatCommandBuilderBase<Options & OptionRequiredPossible<C, number>>;
    }

    oncall(handle: (i: ChatCommandEvent<this['options']>) => void) {
        this.listeners.add(handle);
        return this;
    }
}

type OptionRequiredPossible<C extends Omit<APIApplicationCommandStringOption, 'type'>, T> = C['required'] extends true ? Record<C['name'], T> : Partial<Record<C['name'], T>>;

export class ChatCommandBuilder extends ChatCommandBuilderBase {
    config: RESTPostAPIChatInputApplicationCommandsJSONBody;
    subcommands = new Set<SubcommandBuilder | SubcommandGroupBuilder>();
    constructor(name: string, description: string) {
        super()
        this.config = {
            name, 
            description,
            options: []
        }
    }

    subcommand(builder: SubcommandBuilder): this;
    subcommand(name: string, description: string, handle: ((builder: SubcommandBuilder) => SubcommandBuilder)): this;
    subcommand(resolve: string | SubcommandBuilder, description?: string, handle?: (builder: SubcommandBuilder) => SubcommandBuilder) {
        resolve = resolve instanceof SubcommandBuilder ? resolve : handle!(new SubcommandBuilder(resolve, description!));
        this.subcommands.add(resolve);
        this.config.options?.push(resolve.config);
        return this;
    }

    group(builder: SubcommandGroupBuilder): this;
    group(name: string, description: string, handle: ((builder: SubcommandGroupBuilder) => SubcommandGroupBuilder)): this;
    group(resolve: string | SubcommandGroupBuilder, description?: string, handle?: (builder: SubcommandGroupBuilder) => SubcommandGroupBuilder) {
        resolve = resolve instanceof SubcommandGroupBuilder ? resolve : handle!(new SubcommandGroupBuilder(resolve, description!));
        this.subcommands.add(resolve);
        this.config.options?.push(resolve.config);
        return this;
    }
}

export class SubcommandBuilder extends ChatCommandBuilderBase {
    config: APIApplicationCommandSubcommandOption;
    constructor(name: string, description: string) {
        super();
        this.config = {
            name,
            description,
            type: ApplicationCommandOptionType.Subcommand,
            options: []
        }
    }
}

export class SubcommandGroupBuilder {
    config: APIApplicationCommandSubcommandGroupOption;
    subcommands = new Set<SubcommandBuilder>();
    constructor(name: string, description: string) {
        this.config = {
            name,
            description,
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: []
        }
    }

    subcommand(builder: SubcommandBuilder): this;
    subcommand(name: string, description: string, handle: ((builder: SubcommandBuilder) => SubcommandBuilder)): this;
    subcommand(resolve: string | SubcommandBuilder, description?: string, handle?: (builder: SubcommandBuilder) => SubcommandBuilder) {
        resolve = resolve instanceof SubcommandBuilder ? resolve : handle!(new SubcommandBuilder(resolve, description!));
        this.subcommands.add(resolve);
        this.config.options?.push(resolve.config);
        return this;
    }
}

export class ChatCommandEvent<Options extends Record<string, unknown>> extends CommandEvent {
    options: Options;
    constructor(client: Discord.Client, interaction: APIChatInputApplicationCommandInteraction, options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[] | undefined) {
        super(client, interaction);
        this.options = this.resolveOptions(options) as Options;
    }

    private resolveOptions(options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[] | undefined): Record<string, unknown> {
        if (!options) return {};
        const [first] = options;
        if (!first) return {};
        if (first.type === ApplicationCommandOptionType.Subcommand || first.type === ApplicationCommandOptionType.SubcommandGroup) 
            return this.resolveOptions(first.options);
        const basicOptions = options as APIApplicationCommandInteractionDataBasicOption<InteractionType.ApplicationCommand>[];
        return Object.fromEntries(basicOptions.map(option => [option.name, option.value]))
    }
}