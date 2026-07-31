import type { RESTGetAPIGuildMessagesSearchQuery, RESTGetAPIGuildMessagesSearchResult, RESTGetAPIGuildPreviewResult, RESTGetAPIGuildQuery, RESTGetAPIGuildResult, RESTPatchAPIGuildJSONBody, RESTPatchAPIGuildResult } from "discord-api-types/rest";
import { Discord } from "../../..";
import { GuildBanAPI } from "./GuildBanAPI";
import { GuildMemberAPI } from "./GuildMemberAPI";

export class GuildAPI {
    client; guild_id;
    constructor(client: Discord.Client, guild_id: string) {
        this.client = client;
        this.guild_id = guild_id
    }

    protected get path() {
        return `/guilds/${this.guild_id}`;
    }

    /** 
     * Returns the guild object for the given id.
     * @param with_counts - If with_counts is set to true, 
     * this endpoint will also return approximate_member_count and approximate_presence_count for the guild. 
     * @returns Guild object {@link Discord.Guild}
     */
    async get(with_counts: boolean = false) {
        return this.client.http.get<Discord.Guild.API.Get.Result>(`${this.path}?with_counts=${with_counts}`)
    }

    /**
     * Modify a guild’s settings. 
     * @event Fires a Guild Update Gateway event.
     * @permissions MANAGE_GUILD permission
     * @param params {@link Discord.APIRequest.Guild.ModifyParams}
     * @returns Updated guild object {@link Discord.Guild} on success. 
     */
    async modify(params: Discord.Guild.API.Modify.Params, reason?: string) {
        return this.client.http.patch<Discord.Guild.API.Modify.Result>(`${this.path}`, params, reason)
    }

    /**
     * Delete a guild. Owner only.
     */
    delete(reason?: string) {
        return this.client.http.delete<void>(`${this.path}`, reason)
    }

    /**
     * Returns the guild preview object for the given id. 
     * @condition If the user is not in the guild, then the guild must be discoverable.
     * @returns Guild preview object {@link Discord.Guild.Preview}
     */
    async getPreview() {
        return this.client.http.get<Discord.Guild.API.GetPreview.Result>(`${this.path}/preview`)
    }

    /**
     * HTTP API of guild member for the given id.
     * @param user_id
     */
    member(user_id: string) {
        return new GuildMemberAPI(this.client, this.guild_id, user_id);
    }

    get members() {
        return {
            /** 
             * Returns a list of guild member objects that are members of the guild. 
             * @intents GUILD_MEMBERS Privileged Intent
             * @returns List of guild member object {@link Discord.Guild.Member}
             */
            list: (query?: Discord.Guild.Member.API.List.Query) => {
                return this.client.http.get<Discord.Guild.Member.Data[]>(`${this.path}/members${this.client.http.query(query)}`)
            },
            
            /** 
             * Returns a list of guild member objects whose username or nickname starts with a provided string.
             * @returns List of guild member object {@link Discord.Guild.Member}
             */
            search: (query?: Discord.Guild.Member.API.Search.Query) => {
                return this.client.http.get<Discord.Guild.Member.Data[]>(`${this.path}/members/search${this.client.http.query(query)}`)
            }
        }
    }

    modifyClientMember(params: Discord.Guild.Member.API.ModifyClient.Params, reason?: string) {
        return this.client.http.patch<Discord.Guild.Member.API.ModifyClient.Result>(`${this.path}/members/@me`, params, reason)
    }

    /**
     * HTTP API of guild ban for the given id.
     * @param user_id
     */
    ban(user_id: string) {
        return new GuildBanAPI(this.client, this.guild_id, user_id);
    }

    get bans() {
        return {
            /** 
             * Returns a list of ban objects for the users banned from this guild.
             * @permissions BAN_MEMBERS
             * @returns List of guild ban object {@link Discord.Guild.Ban}
             */
            list: (query?: Discord.Guild.Ban.API.List.Query) => {
                return this.client.http.get<Discord.Guild.Ban.API.List.Result>(`${this.path}/bans${this.client.http.query(query)}`)
            },

            /** 
             * Ban up to 200 users from a guild, and optionally delete previous messages sent by the banned users. 
             * Returns a 200 response on success, including the fields banned_users with the IDs of the banned users and failed_users with IDs 
             * that could not be banned or were already banned.
             * 
             * If none of the users could be banned, an error response code 500000: Failed to ban users is returned instead.
             * @permissions BAN_MEMBERS & MANAGE_GUILD
             * @returns List of guild ban object {@link Discord.Guild.Ban}
             */
            bulk: (params: Discord.Guild.Ban.API.Bulk.Params) => {
                return this.client.http.post<Discord.Guild.Ban.API.Bulk.Result>(`${this.path}/bulk-ban`, params)
            }
        }
    }

    get channels() {
        return {
            /** 
             * Returns a list of guild channel objects. Does not include threads.
             * @returns List of guild channel object {@link Discord.Guild.Channel}
             */
            list: () => {
                return this.client.http.get<Discord.Guild.Channel.API.List.Result>(`${this.path}/channels`)
            },

            /** 
             * Create a new channel object for the guild. 
             * If setting permission overwrites, only permissions your bot has in the guild can be allowed/denied. 
             * Setting MANAGE_ROLES permission in channels is only possible for guild administrators. 
             * Returns the new channel object on success.
             * @event CHANNEL_CREATE
             * @permissions MANAGE_CHANNELS
             * @returns List of guild channel object {@link Discord.Guild.Channel}
             */
            create: (params: Discord.Guild.Channel.API.Create.Params, reason?: string) => {
                return this.client.http.post<Discord.Guild.Channel.API.Create.Result>(`${this.path}/channels`, params, reason)
            },

            /** 
             * Modify the positions of a set of channel objects for the guild. Returns a 204 empty response on success.
             * @event CHANNEL_CREATE
             * @permissions CHANNEL_UPDATE
             * @returns List of guild channel object {@link Discord.Guild.Channel}
             */
            modifyPositions: (params: Discord.Guild.Channel.API.ModifyPosition.Params) => {
                return this.client.http.patch<Discord.Guild.Channel.API.ModifyPosition.Result>(`${this.path}/channels`, params)
            }
        }
    }

    get roles() {
        return {
            /** 
             * Returns a list of role objects for the guild.
             * @returns List of guild role object {@link Discord.Guild.Channel}
             */
            list: () => {
                return this.client.http.get<Discord.Guild.Role.API.List.Result>(`${this.path}/roles`)
            },
            
            /** 
             * Returns a map of role IDs to the number of members with the role. Does not include the @everyone role.
             * @returns Guild role object {@link Discord.Guild.Role}
             */
            getMemberCounts: () => {
                return this.client.http.get<Discord.Guild.Role.API.GetMemberCounts.Result>(`${this.path}/roles/member-counts`)
            },
            
            /** 
             * Create a new role for the guild. Returns the new role object on success.
             * @event GUILD_ROLE_CREATE
             * @permissions MANAGE_ROLES
             * @returns Guild role object {@link Discord.Guild.Role}
             */
            create: (params: Discord.Guild.Role.API.Create.Params, reason?: string) => {
                return this.client.http.post<Discord.Guild.Role.API.Create.Result>(`${this.path}/roles`, params, reason)
            },
            
            /** 
             * Modify the positions of a set of role objects for the guild. Returns a list of all of the guild’s role objects on success.
             * @event GUILD_ROLE_UPDATE
             * @permissions MANAGE_ROLES
             * @returns List of guild role object {@link Discord.Guild.Role}
             */
            modifyPositions: (params: Discord.Guild.Role.API.ModifyPositions.Params, reason?: string) => {
                this.client.http.patch<Discord.Guild.Role.API.ModifyPositions.Result>(`${this.path}/roles`, params, reason)
            }
        }
    }

    get messages() {
        return {
            /**
             * Returns a list of messages without the reactions key that match a search query in the guild.
             * @permissions READ_MESSAGE_HISTORY
             * @returns Guild preview object {@link Discord.Guild.Preview}
             */
            search: (query: Discord.Guild.API.SearchMessages.Query) => {
                return this.client.http.get<Discord.Guild.API.SearchMessages.Result>(`${this.path}/messages/search${this.client.http.query(query)}`)
            }
        }
    }
}

export namespace GuildAPI {
    export namespace Get {
        export type Result = RESTGetAPIGuildResult;
        export type Query = RESTGetAPIGuildQuery;
    }

    export namespace GetPreview {
        export type Result = RESTGetAPIGuildPreviewResult;
    }

    export namespace Modify {
        export type Result = RESTPatchAPIGuildResult;
        export type Params = RESTPatchAPIGuildJSONBody;
    }

    export namespace Delete {
        export type Result = void;
    }

    export namespace SearchMessages {
        export type Result = RESTGetAPIGuildMessagesSearchResult;
        export type Query = RESTGetAPIGuildMessagesSearchQuery;
    }
}