import { type APIGuildInteraction, type APIInteraction } from "discord-api-types/payloads";
import type { Discord } from "../..";

export class BaseEvent<I extends APIInteraction> {
    client; 
    interaction: I;
    constructor(client: Discord.Client, interaction: I) {
        this.client = client;
        this.interaction = interaction;
    }

    inGuild(): this is BaseEvent<APIGuildInteraction> {
        return !!this.interaction.guild
    }
}