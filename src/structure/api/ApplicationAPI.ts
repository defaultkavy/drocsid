import {
    RESTGetAPIApplicationCommandsQuery,
    RESTGetAPIApplicationCommandsResult,
    RESTGetAPIApplicationRoleConnectionMetadataResult,
    RESTGetAPIApplicationGuildCommandsQuery,
    RESTGetAPIApplicationGuildCommandsResult,
    RESTGetAPIApplicationCommandPermissionsResult,
    RESTGetAPIGuildApplicationCommandsPermissionsResult,
    RESTGetCurrentApplicationResult,
    RESTPatchCurrentApplicationJSONBody,
    RESTPatchCurrentApplicationResult,
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPostAPIApplicationCommandsResult,
    RESTPostAPIApplicationGuildCommandsJSONBody,
    RESTPostAPIApplicationGuildCommandsResult,
    RESTPutAPIApplicationCommandsJSONBody,
    RESTPutAPIApplicationCommandsResult,
    RESTPutAPIApplicationGuildCommandsJSONBody,
    RESTPutAPIApplicationGuildCommandsResult,
    RESTPutAPIApplicationRoleConnectionMetadataJSONBody,
    RESTPutAPIApplicationRoleConnectionMetadataResult,
} from "discord-api-types/rest";
import type { Discord } from "../Discord";
import { CommandAPI } from "./CommandAPI";
import { GuildCommandAPI } from "./GuildCommandAPI";

export class ApplicationAPI {
    client: Discord.Client;
    application_id;
    constructor(client: Discord.Client, application_id: string) {
        this.client = client;
        this.application_id = application_id;
    }

    protected get path(): string {
        return `/applications/${this.application_id}`;
    }

    /**
     * Returns the application object associated with the requesting bot user.
     */
    get() {
        return this.client.api.get<ApplicationAPI.Get.Result>(this.path);
    }

    /**
     * Edit properties of the application associated with the requesting bot user.
     * @returns Updated application object
     */
    modify(params: ApplicationAPI.Modify.Params) {
        return this.client.api.patch<ApplicationAPI.Modify.Result>(this.path, params);
    }

    get roleConnectionMetadata() {
        return {
            /**
             * Returns a list of application role connection metadata objects for the given application.
             */
            list: () => {
                return this.client.api.get<ApplicationAPI.RoleConnectionMetadata.List.Result>(
                    `/applications/${this.client.config.client_id}/role-connections/metadata`
                );
            },

            /**
             * Updates and returns a list of application role connection metadata objects for the given application.
             * @permissions Bot must have the `role_connections.write` OAuth2 scope
             */
            update: (params: ApplicationAPI.RoleConnectionMetadata.Update.Params) => {
                return this.client.api.put<ApplicationAPI.RoleConnectionMetadata.Update.Result>(
                    `/applications/${this.client.config.client_id}/role-connections/metadata`,
                    params
                );
            }
        }
    }

    /**
     * HTTP API of a single global application command.
     * @param command_id
     */
    command(command_id: string) {
        return new CommandAPI(this.client, this.client.config.client_id, command_id);
    }



    get commands() {
        return {
            /**
             * Fetch all global commands for this application.
             */
            list: (query?: ApplicationAPI.Command.List.Query) => {
                return this.client.api.get<ApplicationAPI.Command.List.Result>(
                    `${this.path}/commands${this.client.api.query(query)}`
                );
            },

            /**
             * Create a new global command.
             * @event Commands may take up to 1 hour to propagate globally.
             */
            create: (params: ApplicationAPI.Command.Create.Params) => {
                return this.client.api.post<ApplicationAPI.Command.Create.Result>(
                    `${this.path}/commands`, params
                );
            },

            /**
             * Bulk overwrite all global commands. Replaces the full list.
             */
            bulkOverwrite: (params: ApplicationAPI.Command.BulkOverwrite.Params) => {
                return this.client.api.put<ApplicationAPI.Command.BulkOverwrite.Result>(
                    `${this.path}/commands`, params
                );
            }
        }
    }

    guild(guild_id: string) {
        return {
            commands: {
                /**
                 * Fetch all guild commands for this application.
                 */
                list: (query?: ApplicationAPI.Command.Guild.List.Query) => {
                    return this.client.api.get<ApplicationAPI.Command.Guild.List.Result>(
                        `${this.path}/guilds/${guild_id}/commands${this.client.api.query(query)}`
                    );
                },

                /**
                 * Create a new guild command.
                 */
                create: (params: ApplicationAPI.Command.Guild.Create.Params) => {
                    return this.client.api.post<ApplicationAPI.Command.Guild.Create.Result>(
                        `${this.path}/guilds/${guild_id}/commands`, params
                    );
                },

                /**
                 * Bulk overwrite all guild commands. Replaces the full list.
                 */
                bulkOverwrite: (params: ApplicationAPI.Command.Guild.BulkOverwrite.Params) => {
                    return this.client.api.put<ApplicationAPI.Command.Guild.BulkOverwrite.Result>(
                        `${this.path}/guilds/${guild_id}/commands`, params
                    );
                },

                /**
                 * Returns all command permissions for all commands in this guild.
                 */
                permissions: () => {
                    return this.client.api.get<ApplicationAPI.Command.Guild.Permissions.List.Result>(
                        `${this.path}/guilds/${guild_id}/commands/permissions`
                    );
                }
            },

            /**
             * HTTP API of a single guild-scoped application command.
             * @param command_id
             */
            command: (command_id: string) => {
                return new GuildCommandAPI(this.client, this.application_id, command_id, guild_id);
            }
        }
    }
}

export namespace ApplicationAPI {
    export namespace Get {
        export type Result = RESTGetCurrentApplicationResult;
    }

    export namespace Modify {
        export type Result = RESTPatchCurrentApplicationResult;
        export type Params = RESTPatchCurrentApplicationJSONBody;
    }

    export namespace Command {
        export namespace List {
            export type Result = RESTGetAPIApplicationCommandsResult;
            export type Query = RESTGetAPIApplicationCommandsQuery;
        }

        export namespace Create {
            export type Result = RESTPostAPIApplicationCommandsResult;
            export type Params = RESTPostAPIApplicationCommandsJSONBody;
        }

        export namespace BulkOverwrite {
            export type Result = RESTPutAPIApplicationCommandsResult;
            export type Params = RESTPutAPIApplicationCommandsJSONBody;
        }

        export namespace Guild {
            export namespace List {
                export type Result = RESTGetAPIApplicationGuildCommandsResult;
                export type Query = RESTGetAPIApplicationGuildCommandsQuery;
            }

            export namespace Create {
                export type Result = RESTPostAPIApplicationGuildCommandsResult;
                export type Params = RESTPostAPIApplicationGuildCommandsJSONBody;
            }

            export namespace BulkOverwrite {
                export type Result = RESTPutAPIApplicationGuildCommandsResult;
                export type Params = RESTPutAPIApplicationGuildCommandsJSONBody;
            }

            export namespace Permissions {
                export namespace List {
                    export type Result = RESTGetAPIGuildApplicationCommandsPermissionsResult;
                }

                export namespace Get {
                    export type Result = RESTGetAPIApplicationCommandPermissionsResult;
                }
            }
        }
    }

    export namespace RoleConnectionMetadata {
        export namespace List {
            export type Result = RESTGetAPIApplicationRoleConnectionMetadataResult;
        }

        export namespace Update {
            export type Result = RESTPutAPIApplicationRoleConnectionMetadataResult;
            export type Params = RESTPutAPIApplicationRoleConnectionMetadataJSONBody;
        }
    }
}