import type { APIMessage, APIMessageApplicationCommandInteraction } from "..";
import type { Discord } from "../..";
import { CommandBaseEvent } from "./CommandBaseEvent";

export class MessageCommandEvent<I extends APIMessageApplicationCommandInteraction = APIMessageApplicationCommandInteraction> extends CommandBaseEvent<I> {
    message: APIMessage;
    constructor(client: Discord.Client, interaction: I) {
        super(client, interaction);
        this.message = Object.entries(interaction.data.resolved.messages)[0]![1]!
    }
}