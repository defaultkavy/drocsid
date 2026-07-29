import type { RESTDeleteAPIGuildRoleResult, RESTGetAPIGuildRoleMemberCountsResult, RESTGetAPIGuildRoleResult, RESTGetAPIGuildRolesResult, RESTPatchAPIGuildRoleJSONBody, RESTPatchAPIGuildRolePositionsJSONBody, RESTPatchAPIGuildRolePositionsResult, RESTPatchAPIGuildRoleResult, RESTPostAPIGuildRoleJSONBody, RESTPostAPIGuildRoleResult } from "discord-api-types/rest";
import type { Discord } from "../../..";

export class GuildRoleAPI {
    client; guild_id;
    role_id: string;
    constructor(client: Discord.Client, guild_id: string, role_id: string) {
        this.client = client;
        this.guild_id = guild_id;
        this.role_id = role_id;
    }

    protected get path(): string {
        return `/guilds/${this.guild_id}/roles/${this.role_id}`
    }

    /** 
     * Returns a role object for the specified role.
     * @returns Guild role object {@link Discord.Guild.Role}
     */
    get() {
        return this.client.api.get<Discord.Guild.Role.API.Get.Result>(`${this.path}`)
    }
    
    /** 
     * Modify a guild role. Returns the updated role on success.
     * @event GUILD_ROLE_UPDATE
     * @permissions MANAGE_ROLES
     * @returns List of guild role object {@link Discord.Guild.Role}
     */
    modify(params: Discord.Guild.Role.API.Modify.Params, reason?: string) {
        return this.client.api.patch<Discord.Guild.Role.API.Modify.Params>(`${this.path}`, params, reason)
    }

    /** 
     * Delete a guild role. Returns a 204 empty response on success.
     * @event GUILD_ROLE_DELETE
     * @permissions MANAGE_ROLES
     */
    delete(reason?: string) {
        return this.client.api.delete<Discord.Guild.Role.API.Delete.Result>(`${this.path}`, reason)
    }
}

export namespace GuildRoleAPI {
    export namespace Get {
        export type Result = RESTGetAPIGuildRoleResult;
    }

    export namespace List {
        export type Result = RESTGetAPIGuildRolesResult;
    }

    export namespace GetMemberCounts {
        export type Result = RESTGetAPIGuildRoleMemberCountsResult;
    }

    export namespace Create {
        export type Result = RESTPostAPIGuildRoleResult;
        export type Params = RESTPostAPIGuildRoleJSONBody;
    }

    export namespace Modify {
        export type Result = RESTPatchAPIGuildRoleResult;
        export type Params = RESTPatchAPIGuildRoleJSONBody;
    }

    export namespace Delete {
        export type Result = RESTDeleteAPIGuildRoleResult;
    }

    export namespace ModifyPositions {
        export type Result = RESTPatchAPIGuildRolePositionsResult;
        export type Params = RESTPatchAPIGuildRolePositionsJSONBody;
    }
}