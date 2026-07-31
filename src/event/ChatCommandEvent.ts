import { type APIApplicationCommandInteractionDataBasicOption, type APIApplicationCommandInteractionDataOption, type APIChatInputApplicationCommandInteraction, ApplicationCommandOptionType, InteractionType } from "discord-api-types/payloads";
import { Discord } from "../..";
import { CommandBaseEvent } from "./CommandBaseEvent";
import type { ChatCommandBuilderMentionValue, ChatCommandBuilderOption } from "../builder/ChatCommandBuilder";

export class ChatCommandEvent<Options extends Record<string, ChatCommandBuilderOption> = {}> extends CommandBaseEvent {
    data: ResolveChatCommandBuilderOptionsValue<Options>;
    options: ResolveChatCommandBuilderOptions<Options>;
    declare interaction: APIChatInputApplicationCommandInteraction;
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
        return Object.fromEntries(basicOptions.map(option => {
            switch (option.type) {
                case ApplicationCommandOptionType.User:
                    return [option.name, this.interaction.data.resolved?.users?.[option.value]]
                case ApplicationCommandOptionType.Role:
                    return [option.name, this.interaction.data.resolved?.roles?.[option.value]]
                case ApplicationCommandOptionType.Channel:
                    return [option.name, this.interaction.data.resolved?.channels?.[option.value]]
                case ApplicationCommandOptionType.Attachment:
                    return [option.name, this.interaction.data.resolved?.attachments?.[option.value]]
                case ApplicationCommandOptionType.Mentionable:
                    return [option.name, {
                        user: this.interaction.data.resolved?.users?.[option.value],
                        member: this.interaction.data.resolved?.members?.[option.value],
                        role: this.interaction.data.resolved?.roles?.[option.value]
                    } satisfies ChatCommandBuilderMentionValue ]
                default:
                    return [option.name, option.value]
            }
        }))
    }
}

type ResolveChatCommandBuilderOptionsValue<Options extends Record<string, ChatCommandBuilderOption>> = {
    [key in keyof Options]: Options[key]['required'] extends true ? Options[key]['value'] : Options[key]['value'] | undefined
}

type ResolveChatCommandBuilderOptions<Options extends Record<string, ChatCommandBuilderOption>> = {
    [key in keyof Options]: Omit<APIApplicationCommandInteractionDataBasicOption<InteractionType.ApplicationCommand> & { type: Options[key]['type'] }, 'focused'> extends infer V
        ?   Options[key]['required'] extends true
            ?   V
            :   V | undefined
        :   never
}