import type {
    RESTDeleteAPIGuildBanResult,
    RESTGetAPIGuildBanResult,
    RESTGetAPIGuildBansQuery,
    RESTGetAPIGuildBansResult,
    RESTPostAPIGuildBulkBanJSONBody,
    RESTPostAPIGuildBulkBanResult,
    RESTPutAPIGuildBanJSONBody,
    RESTPutAPIGuildBanResult,
} from "discord-api-types/rest";
import type { Discord } from "../../..";

export class GuildBanAPI {
    client: Discord.Client;
    guild_id: string;
    user_id: string;

    constructor(client: Discord.Client, guild_id: string, user_id: string) {
        this.client = client;
        this.guild_id = guild_id;
        this.user_id = user_id;
    }

    protected get path(): string {
        return `/guilds/${this.guild_id}/bans/${this.user_id}`;
    }

    /** 
     * Returns a ban object for the given user or a 404 not found if the ban cannot be found.
     * @permissions BAN_MEMBERS
     * @returns Guild ban object {@link Discord.Guild.Ban}
     */
    get() {
        return this.client.api.get<GuildBanAPI.Get.Result>(`${this.path}`);
    }

    /** 
     * Create a guild ban, and optionally delete previous messages sent by the banned user. 
     * Returns a 204 empty response on success.
     * @event GUILD_BAN_ADD
     * @permissions BAN_MEMBERS
     */
    create(params?: GuildBanAPI.Create.Params, reason?: string) {
        return this.client.api.put<GuildBanAPI.Create.Result>(`${this.path}`, params, reason);
    }

    /** 
     * Remove the ban for a user. Returns a 204 empty response on success.
     * @event GUILD_BAN_REMOVE
     * @permissions BAN_MEMBERS
     */
    remove(reason?: string) {
        return this.client.api.delete<GuildBanAPI.Remove.Result>(`${this.path}`, undefined, reason);
    }
}

export namespace GuildBanAPI {
    export namespace Get {
        export type Result = RESTGetAPIGuildBanResult;
    }

    export namespace Create {
        export type Result = RESTPutAPIGuildBanResult;
        export type Params = RESTPutAPIGuildBanJSONBody;
    }

    export namespace Remove {
        export type Result = RESTDeleteAPIGuildBanResult;
    }

    export namespace List {
        export type Result = RESTGetAPIGuildBansResult;
        export type Query = RESTGetAPIGuildBansQuery;
    }

    export namespace Bulk {
        export type Result = RESTPostAPIGuildBulkBanResult;
        export type Params = RESTPostAPIGuildBulkBanJSONBody;
    }
}