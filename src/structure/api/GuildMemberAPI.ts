import type { RESTDeleteAPIGuildMemberRoleResult, RESTGetAPIGuildMemberResult, RESTGetAPIGuildMembersQuery, RESTGetAPIGuildMembersResult, RESTGetAPIGuildMembersSearchQuery, RESTGetAPIGuildMembersSearchResult, RESTPatchAPICurrentGuildMemberJSONBody, RESTPatchAPICurrentGuildMemberResult, RESTPatchAPIGuildMemberJSONBody, RESTPatchAPIGuildMemberResult, RESTPutAPIGuildMemberJSONBody, RESTPutAPIGuildMemberResult, RESTPutAPIGuildMemberRoleResult } from "discord-api-types/rest";
import type { Discord } from "../../..";
import { GuildMemberRoleAPI } from "./GuildMemberRoleAPI";

export class GuildMemberAPI {
    client; guild_id; user_id;
    constructor(client: Discord.Client, guild_id: string, user_id: string) {
        this.client = client;
        this.guild_id = guild_id;
        this.user_id = user_id;
    }

    protected get path() {
        return `/guilds/${this.guild_id}/members/${this.user_id}`
    }

    /**
     * Returns a guild member object for the specified user.
      * @returns Guild member object {@link Discord.Guild.Member.API.Get.Result}
     */
    get() {
        return this.client.http.get<Discord.Guild.Member.API.Get.Result>(`${this.path}`)
    }

    /** 
     * Modify attributes of a guild member. Returns a 200 OK with the guild member as the body. 
     * If the channel_id is set to null, * this will force the target user to be disconnected from voice.
     * @event GUILD_MEMBER_UPDATE
      * @returns Updated guild member object {@link Discord.Guild.Member.API.Modify.Result}
     */
    modify(params: Discord.Guild.Member.API.Modify.Params) {
        return this.client.http.patch<Discord.Guild.Member.API.Modify.Result>(`${this.path}`, params)
    }

    /** 
     * Remove a member from a guild. Requires KICK_MEMBERS permission. Returns a 204 empty response on success.
     * @event GUILD_MEMBER_ADD
     * @permissions KICK_MEMBERS
     */
    remove() {
        return this.client.http.delete<Discord.Guild.Member.API.Remove.Result>(`${this.path}`)
    }
    
    /** 
     * Adds a user to the guild, provided you have a valid oauth2 access token for the user with the guilds.join scope. 
     * Returns a 201 Created with the guild member as the body, or 204 No Content if the user is already a member of the guild. 
     * 
     * For guilds with Membership Screening enabled, this endpoint will default to adding new members as pending in the guild member object. 
     * Members that are pending will have to complete membership screening before they become full members that can talk.
     * @event GUILD_MEMBER_ADD
    * @returns Added guild member result {@link Discord.Guild.Member.API.Add.Result}
     */
    add(params: Discord.Guild.Member.API.Add.Params) {
        return this.client.http.put<Discord.Guild.Member.API.Add.Result>(`${this.path}`, params)
    }

    role(role_id: string) {
        return new GuildMemberRoleAPI(this.client, this.guild_id, this.user_id, role_id)
    }
}



export namespace GuildMemberAPI {
    export namespace Get {
        export type Result = RESTGetAPIGuildMemberResult;
    }

    export namespace Modify {
        export type Result = RESTPatchAPIGuildMemberResult;
        export type Params = RESTPatchAPIGuildMemberJSONBody;
    }

    export namespace Remove {
        export type Result = void;
    }

    export namespace ModifyClient {
        export type Result = RESTPatchAPICurrentGuildMemberResult;
        export type Params = RESTPatchAPICurrentGuildMemberJSONBody;
    }

    export namespace List {
        export type Result = RESTGetAPIGuildMembersResult;
        export type Query = RESTGetAPIGuildMembersQuery;
    }

    export namespace Add {
        export type Result = RESTPutAPIGuildMemberResult;
        export type Params = RESTPutAPIGuildMemberJSONBody;
    }

    export namespace Search {
        export type Result = RESTGetAPIGuildMembersSearchResult;
        export type Query = RESTGetAPIGuildMembersSearchQuery;
    }

    export namespace Role {
        export namespace Add {
            export type Result = RESTPutAPIGuildMemberRoleResult;
        }

        export namespace Remove {
            export type Result = RESTDeleteAPIGuildMemberRoleResult;
        }
    }
}