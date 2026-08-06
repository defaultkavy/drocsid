import type { RESTDeleteAPICurrentUserGuildResult, RESTGetAPICurrentUserGuildsQuery, RESTGetAPICurrentUserGuildsResult, RESTPatchAPICurrentUserJSONBody, RESTPatchAPICurrentUserResult } from "discord-api-types/rest";
import { UserAPI } from "./UserAPI";
import type { Discord } from "../../..";

export class ClientUserAPI extends UserAPI {
    constructor(base: Discord.Client.Base) {
        super(base, '@me');
    }

    /**
     * Modify the requester’s user account settings. Returns a user object on success.
     * @event USER_UPDATE
      * @returns User object {@link Discord.Client.User.API.Modify.Result}
     */
    modify(params: Discord.Client.User.API.Modify.Params) {
        return this.client.http.patch<Discord.Client.User.API.Modify.Result>(`${this.path}`, params);
    }

    /**
     * Returns a list of partial guild objects the current user is a member of. For OAuth2, requires the guilds scope.
      * @returns List of partial guild objects {@link Discord.Client.User.API.GetGuilds.Result}
     */
    getGuilds() {
        return this.client.http.get<Discord.Client.User.API.GetGuilds.Result>(`${this.path}/guilds`)
    }

    /**
     * Returns a guild member object for the current user.
     * @scope guilds.members.read
      * @returns Guild member object {@link Discord.Client.User.API.GetGuildMember.Result}
     */
    getGuildMember(guild_id: string) {
        return this.client.http.get<Discord.Client.User.API.GetGuildMember.Result>(`${this.path}/guilds/${guild_id}/member`)
    }

    /**
     * Leave a guild. Returns a 204 empty response on success.
     * @event GUILD_DELETE & GUILD_MEMBER_REMOVE
     */
    leaveGuild(guild_id: string) {
        return this.client.http.delete<Discord.Client.User.API.Leave.Result>(`${this.path}/guilds/${guild_id}`)
    }
}

export namespace ClientUserAPI {
    export namespace Modify {
        export type Result = RESTPatchAPICurrentUserResult;
        export type Params = RESTPatchAPICurrentUserJSONBody;
    }

    export namespace GetGuilds {
        export type Result = RESTGetAPICurrentUserGuildsResult;
        export type Query = RESTGetAPICurrentUserGuildsQuery;
    }

    export namespace GetGuildMember {
        export type Result = Discord.Guild.Member.Data;
    }

    export namespace Leave {
        export type Result = RESTDeleteAPICurrentUserGuildResult;
    }
}