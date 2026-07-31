import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/rest";
import { type APIApplicationCommandSubcommandGroupOption, type APIApplicationCommandAttachmentOption, type APIApplicationCommandBooleanOption, type APIApplicationCommandChannelOption, type APIApplicationCommandIntegerOption, type APIApplicationCommandMentionableOption, type APIApplicationCommandNumberOption, type APIApplicationCommandRoleOption, type APIApplicationCommandStringOption, type APIApplicationCommandSubcommandOption, type APIApplicationCommandUserOption, ApplicationCommandOptionType, type APIApplicationCommandBasicOption, type APIApplicationCommandInteractionDataBasicOption, type APIUser, type APIRole, type APIInteractionDataResolvedGuildMember, type APIInteractionDataResolvedChannel, type APIAttachment } from "discord-api-types/payloads";
import { CommandBuilder } from "./CommandBuilder";
import { ChatCommandEvent } from "../event/ChatCommandEvent";
import type { AutocompleteEvent } from "../event/AutocompleteEvent";

export abstract class ChatCommandBuilderBase<Options extends Record<string, ChatCommandBuilderOption> = {}> extends CommandBuilder {
    declare options: Options;
    abstract override config: RESTPostAPIChatInputApplicationCommandsJSONBody | APIApplicationCommandSubcommandOption;
    listeners = new Set<(i: ChatCommandEvent<Options>) => void>();
    autocompleteListeners = new Set<(e: AutocompleteEvent<Options>) => void>();

    use<T extends this>(handle: (builder: this) => T) {
        handle(this);
        return this as T;
    }

    stringOption<N extends string, const C extends Omit<APIApplicationCommandStringOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.String, name, description} as APIApplicationCommandStringOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.String, value: string, required: C['required'], autocomplete: C['autocomplete'] }>>;
    }

    integerOption<N extends string, const C extends Omit<APIApplicationCommandIntegerOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.Integer, name, description} as APIApplicationCommandIntegerOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.Integer, value: number, required: C['required'], autocomplete: C['autocomplete'] }>>;
    }

    numberOption<N extends string, const C extends Omit<APIApplicationCommandNumberOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.Number, name, description} as APIApplicationCommandNumberOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.Number, value: number, required: C['required'], autocomplete: C['autocomplete'] }>>;
    }

    booleanOption<N extends string, const C extends Omit<APIApplicationCommandBooleanOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.Boolean, name, description} as APIApplicationCommandBooleanOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.Boolean, value: boolean, required: C['required'] }>>;
    }
    
    attachmentOption<N extends string, const C extends Omit<APIApplicationCommandAttachmentOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.Attachment, name, description} as APIApplicationCommandAttachmentOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.Attachment, value: APIAttachment, required: C['required'] }>>;
    }

    userOption<N extends string, const C extends Omit<APIApplicationCommandUserOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.User, name, description} as APIApplicationCommandUserOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.User, value: APIUser, required: C['required'] }>>;
    }

    channelOption<N extends string, const C extends Omit<APIApplicationCommandChannelOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.Channel, name, description} as APIApplicationCommandChannelOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.Channel, value: APIInteractionDataResolvedChannel, required: C['required'] }>>;
    }

    roleOption<N extends string, const C extends Omit<APIApplicationCommandRoleOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.Role, name, description} as APIApplicationCommandRoleOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.Role, value: APIRole, required: C['required'] }>>;
    }

    mentionableOption<N extends string, const C extends Omit<APIApplicationCommandMentionableOption, 'type' | 'name' | 'description'>>(name: N, description: string, config?: C) {
        this.config.options?.push({...config, type: ApplicationCommandOptionType.Mentionable, name, description} as APIApplicationCommandMentionableOption);
        return this as this & ChatCommandBuilderBase<Options & Record<N, { name: N, type: ApplicationCommandOptionType.Mentionable, value: ChatCommandBuilderMentionValue, required: C['required'] }>>;
    }

    oncall(handle: (e: ChatCommandEvent<this['options']>) => void) {
        this.listeners.add(handle);
        return this;
    }

    onautocomplete(handle: (e: AutocompleteEvent<this['options']>) => void) {
        this.autocompleteListeners.add(handle);
        return this;
    }
}

export type APIApplicationCommandAutocompleteOptions = APIApplicationCommandStringOption | APIApplicationCommandIntegerOption | APIApplicationCommandNumberOption;
export type APIApplicationCommandNonAutocompleteOptions = Exclude<APIApplicationCommandBasicOption, APIApplicationCommandAutocompleteOptions>;

export type ChatCommandBuilderOption = ChatCommandBuilderNonAutocompleteOption | ChatCommandBuilderAutocompleteOption;
export type ChatCommandBuilderBasicOption = APIApplicationCommandInteractionDataBasicOption & { required: boolean }
export type ChatCommandBuilderNonAutocompleteOption = ChatCommandBuilderBasicOption;
export type ChatCommandBuilderAutocompleteOption = ChatCommandBuilderBasicOption & { autocomplete: boolean };

export type ChatCommandBuilderMentionValue = {
    user?: APIUser;
    role?: APIRole;
    member?: APIInteractionDataResolvedGuildMember;
}

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