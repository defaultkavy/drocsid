import type { APIUser, APIUserApplicationCommandInteraction } from "discord-api-types/payloads";
import { Discord } from "../..";
import { CommandBaseEvent } from "./CommandBaseEvent";

export class UserCommandEvent extends CommandBaseEvent {
    declare interaction: APIUserApplicationCommandInteraction;
    user: APIUser;
    constructor(client: Discord.Client, interaction: APIUserApplicationCommandInteraction) {
        super(client, interaction);
        this.user = Object.entries(interaction.data.resolved.users)[0]![1]!
    }
}