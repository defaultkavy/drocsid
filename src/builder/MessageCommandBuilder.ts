import { type APIMessage, type APIMessageApplicationCommandInteraction, ApplicationCommandType } from "discord-api-types/payloads";
import type { RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord-api-types/rest";
import { CommandBaseEvent } from "../event/CommandBaseEvent";
import { CommandBuilder } from "./CommandBuilder";
import type { Discord } from "../..";

export class MessageCommandBuilder extends CommandBuilder {
    listeners = new Set<(i: MessageCommandEvent) => void>();
    config: RESTPostAPIContextMenuApplicationCommandsJSONBody;
    constructor(name: string) {
        super();
        this.config = {
            name,
            type: ApplicationCommandType.Message,
            name_localizations: {},
            description_localizations: {}
        }
    }

    oncall(handle: (i: MessageCommandEvent) => void) {
        this.listeners.add(handle);
        return this;
    }
}

export class MessageCommandEvent extends CommandBaseEvent {
    declare interaction: APIMessageApplicationCommandInteraction;
    message: APIMessage;
    constructor(client: Discord.Client, interaction: APIMessageApplicationCommandInteraction) {
        super(client, interaction);
        this.message = Object.entries(interaction.data.resolved.messages)[0]![1]!
    }
}