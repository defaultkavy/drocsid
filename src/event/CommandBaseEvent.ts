import type { APIApplicationCommandInteraction } from "discord-api-types/payloads";
import { Discord } from "../..";
import { ReplyBaseEvent } from "./ReplyBaseEvent";

export class CommandBaseEvent<I extends APIApplicationCommandInteraction> extends ReplyBaseEvent<I> {
    constructor(client: Discord.Client, interaction: I) {
        super(client, interaction)
    }
}