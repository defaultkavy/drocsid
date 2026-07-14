import { APIUser, APIUserApplicationCommandInteraction, ApplicationCommandType } from "discord-api-types/payloads";
import { CommandBuilder, CommandEvent } from "./CommandBuilder";
import { RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord-api-types/rest";
import { Discord } from "../structure/Discord";

export class UserCommandBuilder extends CommandBuilder {
    listeners = new Set<(i: UserCommandEvent) => void>();
    config: RESTPostAPIContextMenuApplicationCommandsJSONBody;
    constructor(name: string) {
        super();
        this.config = {
            name,
            type: ApplicationCommandType.User,
        }
    }

    oncall(handle: (i: UserCommandEvent) => void) {
        this.listeners.add(handle);
        return this;
    }
}

export class UserCommandEvent extends CommandEvent {
    declare interaction: APIUserApplicationCommandInteraction;
    user: APIUser;
    constructor(client: Discord.Client, interaction: APIUserApplicationCommandInteraction) {
        super(client, interaction);
        this.user = Object.entries(interaction.data.resolved.users)[0]![1]!
    }
}