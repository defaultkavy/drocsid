import { ApplicationCommandType } from "discord-api-types/payloads";
import { CommandBuilder } from "./CommandBuilder";
import type { RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord-api-types/rest";
import type { UserCommandEvent } from "../event/UserCommandEvent";

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