import type { APIApplicationCommandInteraction } from "discord-api-types/payloads";
import { Discord } from "../..";
import { ReplyBaseEvent } from "./ReplyBaseEvent";

export class CommandBaseEvent extends ReplyBaseEvent {
    declare interaction: APIApplicationCommandInteraction;
    constructor(client: Discord.Client, interaction: APIApplicationCommandInteraction) {
        super(client, interaction)
    }
}