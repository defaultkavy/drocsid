import { type APIApplicationCommandBasicOption, type APIApplicationCommandInteractionDataBasicOption, type APIApplicationCommandInteractionDataOption, type APIApplicationCommandOption, type APIChatInputApplicationCommandInteraction, ApplicationCommandOptionType, InteractionType } from "discord-api-types/payloads";
import { Discord } from "../..";
import { CommandBaseEvent } from "./CommandBaseEvent";
import type { ChatCommandBuilderOption } from "../builder/ChatCommandBuilder";

export class ChatCommandEvent<Options extends Record<string, ChatCommandBuilderOption>> extends CommandBaseEvent {
    data: ResolveChatCommandBuilderOptionsValue<Options>;
    options: ResolveChatCommandBuilderOptions<Options>;
    constructor(client: Discord.Client, interaction: APIChatInputApplicationCommandInteraction, options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[] | undefined) {
        super(client, interaction);
        this.data = this.resolveOptions(options) as any;
        this.options = options as any;
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

type ResolveChatCommandBuilderOptionsValue<Options extends Record<string, ChatCommandBuilderOption>> = {
    [key in keyof Options]: Options[key]['required'] extends true ? Options[key]['value'] : Options[key]['value'] | undefined
}

type ResolveChatCommandBuilderOptions<Options extends Record<string, ChatCommandBuilderOption>> = {
    [key in keyof Options]: Omit<APIApplicationCommandInteractionDataBasicOption<InteractionType.ApplicationCommand> & { type: Options[key]['type'] }, 'focused'>
}