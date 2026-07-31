import { type APIGuildInteraction, type APIInteraction } from "discord-api-types/payloads";
import type { Discord } from "../..";

export class BaseEvent {
    client; interaction;
    constructor(client: Discord.Client, interaction: APIInteraction) {
        this.client = client;
        this.interaction = interaction;
    }

    inGuild(): this is BaseGuildEvent {
        return !!this.interaction.guild
    }
}

export interface BaseGuildEvent extends BaseEvent {
    interaction: APIGuildInteraction
}