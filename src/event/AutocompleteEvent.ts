import { ApplicationCommandOptionType, InteractionResponseType, InteractionType, type APIApplicationCommandAutocompleteGuildInteraction, type APIApplicationCommandAutocompleteInteraction, type APIApplicationCommandInteractionDataBasicOption, type APIApplicationCommandOptionChoice, type APIAutocompleteApplicationCommandInteractionData } from "discord-api-types/payloads";
import type { Discord } from "../..";
import { BaseEvent } from "./BaseEvent";
import { loggerMap } from "../lib/logger";
import type { ChatCommandBuilderOption } from "../builder/ChatCommandBuilder";

export class AutocompleteEvent<Options extends Record<string, ChatCommandBuilderOption>, I extends APIApplicationCommandAutocompleteInteraction = APIApplicationCommandAutocompleteInteraction> extends BaseEvent<I> {
    focused: ResolveFocusedOption<Options>;
    data: PartialOptionsValue<Options>;
    options: ResolveAutocompleteOptions<Options>;
    constructor(client: Discord.Client, interaction: I) {
        super(client, interaction);
        const res = this.resolveAutocomplete(interaction.data);
        this.data = res.data as any
        this.options = res.options as any;
        this.focused = res.focused as any;
    }

    override inGuild(): this is AutocompleteEvent<Options, APIApplicationCommandAutocompleteGuildInteraction> {
        return super.inGuild();
    }

    response(choices: APIApplicationCommandOptionChoice[]) {
        this.client.interaction(this.interaction.id, this.interaction.token).callback({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices
            }
        })
    }

    private resolveAutocomplete(data: APIAutocompleteApplicationCommandInteractionData) {
        if (!data.options) throw loggerMap.builder.prefix(`resolveAutocomplete()`).error('data options is undefined');
        const resolveOption = (options: Exclude<APIAutocompleteApplicationCommandInteractionData['options'], undefined>): APIApplicationCommandInteractionDataBasicOption[] => {
            const [first] = options!;
            if (!first) throw loggerMap.builder.prefix(`resolveAutocomplete()`).error('first option is undefined');
            if (first.type === ApplicationCommandOptionType.Subcommand || first.type === ApplicationCommandOptionType.SubcommandGroup) {
                if (!first.options) throw loggerMap.builder.prefix(`resolveAutocomplete()`).error('options is undefined');
                return resolveOption(first.options);
            }
            return options as APIApplicationCommandInteractionDataBasicOption[];
        }

        const options = resolveOption(data.options);
        return {
            focused: options.find(option => {
                if (option.type !== ApplicationCommandOptionType.String && option.type !== ApplicationCommandOptionType.Integer && option.type !== ApplicationCommandOptionType.Number) return;
                return option.focused
            }),
            data: Object.fromEntries(options.map(option => [option.name, option.value])),
            options: Object.fromEntries(options.map(option => [option.name, option]))
        }
    }
}

type ResolveFocusedOption<Options extends Record<string, ChatCommandBuilderOption>> = 
    Options[keyof Options] extends infer Option 
        ? Option extends { autocomplete: true } 
            ? Omit<Option, 'required' | 'autocomplete'> 
            : never 
        : never;

type ResolveAutocompleteOptions<Options extends Record<string, ChatCommandBuilderOption>> = {
    [key in keyof Options]: 
        Options[key] extends infer Option
        ?   Option extends { autocomplete: true }
            ?   Omit<APIApplicationCommandInteractionDataBasicOption<InteractionType.ApplicationCommandAutocomplete>, 'focused'> & { type: Options[key]['type'], focused?: boolean }
            :   Omit<APIApplicationCommandInteractionDataBasicOption<InteractionType.ApplicationCommandAutocomplete>, 'focused'> & { type: Options[key]['type'] }
        :   never
}

type PartialOptionsValue<Options extends Record<string, ChatCommandBuilderOption>> = {
    [key in keyof Options]: Options[key]['value'] | undefined
}