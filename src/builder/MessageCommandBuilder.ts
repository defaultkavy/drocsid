import { ApplicationCommandType } from "discord-api-types/payloads";
import type { RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord-api-types/rest";
import { CommandBuilder } from "./CommandBuilder";
import type { MessageCommandEvent } from "../event/MessageCommandEvent";

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