import type { RESTGetAPIUserResult } from "discord-api-types/rest";
import type { Discord } from "../../..";

export class UserAPI {
    user_id: string;
    client: Discord.Client;
    constructor(base: Discord.Client.Base, user_id: string) {
        this.client = base.client
        this.user_id = user_id;
    }

    protected get path() {
        return `/users/${this.user_id}`
    }

    /**
     * Returns a user object for a given user ID.
     * @returns User object {@link Discord.User}
     */
    get() {
        return this.client.api.get<UserAPI.Get.Result>(`${this.path}`)
    }
}

export namespace UserAPI {
    export namespace Get {
        export type Result = RESTGetAPIUserResult;
    }
}