import type { APIUser, APIUserApplicationCommandDMInteraction, APIUserApplicationCommandGuildInteraction, APIUserApplicationCommandInteraction } from "discord-api-types/payloads";
import { Discord } from "../..";
import { CommandBaseEvent } from "./CommandBaseEvent";

export class UserCommandEvent<I extends APIUserApplicationCommandInteraction = APIUserApplicationCommandInteraction> extends CommandBaseEvent<I> {
    user: APIUser;
    constructor(client: Discord.Client, interaction: I) {
        super(client, interaction);
        this.user = Object.entries(interaction.data.resolved.users)[0]![1]!
    }

    override inGuild(): this is UserCommandEvent<APIUserApplicationCommandGuildInteraction> {
        return !!this.interaction.guild
    }

    override inDM(): this is UserCommandEvent<APIUserApplicationCommandDMInteraction> {
        return !!this.interaction.user
    }
}