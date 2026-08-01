import type {
    RESTGetAPIApplicationCommandPermissionsResult,
    RESTGetAPIApplicationCommandResult,
    RESTGetAPIApplicationGuildCommandResult,
    RESTPatchAPIApplicationCommandJSONBody,
    RESTPatchAPIApplicationCommandResult,
    RESTPatchAPIApplicationGuildCommandJSONBody,
    RESTPatchAPIApplicationGuildCommandResult,
    RESTPutAPIApplicationCommandPermissionsJSONBody,
    RESTPutAPIApplicationCommandPermissionsResult,
} from "discord-api-types/rest";
import type { Discord } from "../../..";

export class CommandAPI {
    client: Discord.Client;
    application_id: string;
    command_id: string;

    constructor(client: Discord.Client, application_id: string, command_id: string) {
        this.client = client;
        this.application_id = application_id;
        this.command_id = command_id;
    }

    protected get path(): string {
        return `/applications/${this.application_id}/commands/${this.command_id}`;
    }

    /**
     * Returns the command object.
     */
    get(): Promise<CommandAPI.Get.Result | CommandAPI.Guild.Get.Result> {
        return this.client.http.get<CommandAPI.Get.Result | CommandAPI.Guild.Get.Result>(`${this.path}`);
    }

    /**
     * Edit the command.
     */
    modify(params: CommandAPI.Modify.Params | CommandAPI.Guild.Modify.Params) {
        return this.client.http.patch<CommandAPI.Modify.Result | CommandAPI.Guild.Modify.Result>(`${this.path}`, params);
    }

    /**
     * Delete the command. Returns 204 No Content on success.
     */
    delete() {
        return this.client.http.delete<CommandAPI.Delete.Result>(`${this.path}`);
    }
}

export namespace CommandAPI {
    export namespace Get {
        export type Result = RESTGetAPIApplicationCommandResult;
    }

    export namespace Modify {
        export type Result = RESTPatchAPIApplicationCommandResult;
        export type Params = RESTPatchAPIApplicationCommandJSONBody;
    }

    export namespace Delete {
        export type Result = undefined;
    }

    export namespace Guild {
        export namespace Get {
            export type Result = RESTGetAPIApplicationGuildCommandResult;
        }

        export namespace Modify {
            export type Result = RESTPatchAPIApplicationGuildCommandResult;
            export type Params = RESTPatchAPIApplicationGuildCommandJSONBody;
        }
    }

    export namespace Permissions {
        export namespace Get {
            export type Result = RESTGetAPIApplicationCommandPermissionsResult;
        }

        export namespace Update {
            export type Result = RESTPutAPIApplicationCommandPermissionsResult;
            export type Params = RESTPutAPIApplicationCommandPermissionsJSONBody;
        }
    }
}
