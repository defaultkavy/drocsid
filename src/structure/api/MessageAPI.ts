import type {
    RESTDeleteAPIChannelAllMessageReactionsResult,
    RESTDeleteAPIChannelMessageOwnReactionResult,
    RESTDeleteAPIChannelMessageReactionResult,
    RESTDeleteAPIChannelMessageResult,
    RESTDeleteAPIChannelMessageUserReactionResult,
    RESTDeleteAPIChannelMessagesPinResult,
    RESTGetAPIChannelMessageReactionUsersQuery,
    RESTGetAPIChannelMessageReactionUsersResult,
    RESTGetAPIChannelMessageResult,
    RESTPatchAPIChannelMessageJSONBody,
    RESTPatchAPIChannelMessageResult,
    RESTPostAPIChannelMessageCrosspostResult,
    RESTPostAPIChannelMessagesThreadsJSONBody,
    RESTPostAPIChannelMessagesThreadsResult,
    RESTPutAPIChannelMessageReactionResult,
    RESTPutAPIChannelMessagesPinResult,
} from "discord-api-types/rest";
import { Discord } from "../../..";
import { MessageReactionAPI } from "./MessageReactionAPI";

export class MessageAPI {
    client; channel_id; message_id;
    constructor(client: Discord.Client, channel_id: string, message_id: string) {
        this.client = client;
        this.channel_id = channel_id;
        this.message_id = message_id;
    }

    protected get path(): string {
        return `/channels/${this.channel_id}/messages/${this.message_id}`;
    }

    /**
     * Returns a specific message in the channel.
     * @permissions VIEW_CHANNEL & READ_MESSAGE_HISTORY
     * @returns Message object
     */
    get() {
        return this.client.api.get<MessageAPI.Get.Result>(`${this.path}`);
    }

    /**
     * Edit a previously sent message.
     * @event MESSAGE_UPDATE
     * @permissions SEND_MESSAGES (own message) or MANAGE_MESSAGES (other users' messages)
     * @returns Updated message object
     */
    modify(params: MessageAPI.Modify.Params) {
        return this.client.api.patch<MessageAPI.Modify.Result>(`${this.path}`, params);
    }

    /**
     * Delete a message.
     * @event MESSAGE_DELETE
     * @permissions MANAGE_MESSAGES (when deleting other users' messages)
     */
    delete(reason?: string) {
        return this.client.api.delete<MessageAPI.Delete.Result>(`${this.path}`, undefined, reason);
    }

    /**
     * Crosspost a message in an announcement channel to following channels.
     * @event MESSAGE_UPDATE
     * @permissions SEND_MESSAGES
     * @returns Crossposted message object
     */
    crosspost() {
        return this.client.api.post<MessageAPI.Crosspost.Result>(`${this.path}/crosspost`, {});
    }

    /**
     * Pin this message to the channel.
     * @permissions MANAGE_MESSAGES
     */
    pin(reason?: string) {
        return this.client.api.put<MessageAPI.Pin.Result>(`/channels/${this.channel_id}/messages/pins/${this.message_id}`, undefined, reason);
    }

    /**
     * Unpin this message from the channel.
     * @permissions MANAGE_MESSAGES
     */
    unpin(reason?: string) {
        return this.client.api.delete<MessageAPI.Unpin.Result>(`/channels/${this.channel_id}/messages/pins/${this.message_id}`, undefined, reason);
    }

    /**
     * Start a thread from this message.
     * @event THREAD_CREATE
     * @permissions CREATE_PUBLIC_THREADS
     */
    startThread(params: MessageAPI.StartThread.Params, reason?: string) {
        return this.client.api.post<MessageAPI.StartThread.Result>(`${this.path}/threads`, params, reason);
    }

    get reactions() {
        return {
            /**
             * Delete all reactions for this message.
             * @permissions MANAGE_MESSAGES
             */
            deleteAll: () => {
                return this.client.api.delete<MessageAPI.Reaction.DeleteAll.Result>(`${this.path}/reactions`);
            },
        };
    }

    reaction(emoji_id: string) {
        return new MessageReactionAPI(this.client, this.channel_id, this.message_id, emoji_id);
    }
}

export namespace MessageAPI {
    export namespace Get {
        export type Result = RESTGetAPIChannelMessageResult;
    }

    export namespace Modify {
        export type Result = RESTPatchAPIChannelMessageResult;
        export type Params = RESTPatchAPIChannelMessageJSONBody;
    }

    export namespace Delete {
        export type Result = RESTDeleteAPIChannelMessageResult;
    }

    export namespace Crosspost {
        export type Result = RESTPostAPIChannelMessageCrosspostResult;
    }

    export namespace Pin {
        export type Result = RESTPutAPIChannelMessagesPinResult;
    }

    export namespace Unpin {
        export type Result = RESTDeleteAPIChannelMessagesPinResult;
    }

    export namespace StartThread {
        export type Result = RESTPostAPIChannelMessagesThreadsResult;
        export type Params = RESTPostAPIChannelMessagesThreadsJSONBody;
    }

    export namespace Reaction {
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

        export namespace DeleteAll {
            export type Result = RESTDeleteAPIChannelAllMessageReactionsResult;
        }

        export namespace DeleteEmoji {
            export type Result = RESTDeleteAPIChannelMessageReactionResult;
        }
    }
}