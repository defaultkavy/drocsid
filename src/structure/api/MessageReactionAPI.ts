import type {
    RESTDeleteAPIChannelMessageOwnReactionResult,
    RESTDeleteAPIChannelMessageReactionResult,
    RESTDeleteAPIChannelMessageUserReactionResult,
    RESTGetAPIChannelMessageReactionUsersQuery,
    RESTGetAPIChannelMessageReactionUsersResult,
    RESTPutAPIChannelMessageReactionResult,
} from "discord-api-types/rest";
import { Discord } from "../../..";

export class MessageReactionAPI {
    client: Discord.Client;
    channel_id: string;
    message_id: string;
    emoji_id: string;

    constructor(client: Discord.Client, channel_id: string, message_id: string, emoji_id: string) {
        this.client = client;
        this.channel_id = channel_id;
        this.message_id = message_id;
        this.emoji_id = emoji_id;
    }

    protected get path(): string {
        return `/channels/${this.channel_id}/messages/${this.message_id}/reactions/${encodeURIComponent(this.emoji_id)}`;
    }

    /**
     * Create this reaction for the current user.
     * @permissions READ_MESSAGE_HISTORY (and ADD_REACTIONS when adding a new emoji reaction)
     */
    create() {
        return this.client.api.put<MessageReactionAPI.Create.Result>(`${this.path}/@me`);
    }

    /**
     * Delete this reaction for the current user.
     * @permissions READ_MESSAGE_HISTORY
     */
    deleteClient() {
        return this.client.api.delete<MessageReactionAPI.DeleteOwn.Result>(`${this.path}/@me`);
    }

    /**
     * Delete this reaction for a specific user.
     * @permissions MANAGE_MESSAGES
     */
    deleteUser(user_id: string) {
        return this.client.api.delete<MessageReactionAPI.DeleteUser.Result>(`${this.path}/${user_id}`);
    }

    /**
     * Get users who added this reaction.
     * @permissions READ_MESSAGE_HISTORY
     */
    getUsers(query?: MessageReactionAPI.GetUsers.Query) {
        return this.client.api.get<MessageReactionAPI.GetUsers.Result>(`${this.path}${this.client.api.query(query)}`);
    }

    /**
     * Delete this emoji reaction from the message for all users.
     * @permissions MANAGE_MESSAGES
     */
    delete() {
        return this.client.api.delete<MessageReactionAPI.Delete.Result>(`${this.path}`);
    }
}

export namespace MessageReactionAPI {
    export namespace Create {
        export type Result = RESTPutAPIChannelMessageReactionResult;
    }

    export namespace DeleteOwn {
        export type Result = RESTDeleteAPIChannelMessageOwnReactionResult;
    }

    export namespace DeleteUser {
        export type Result = RESTDeleteAPIChannelMessageUserReactionResult;
    }

    export namespace GetUsers {
        export type Result = RESTGetAPIChannelMessageReactionUsersResult;
        export type Query = RESTGetAPIChannelMessageReactionUsersQuery;
    }

    export namespace Delete {
        export type Result = RESTDeleteAPIChannelMessageReactionResult;
    }
}