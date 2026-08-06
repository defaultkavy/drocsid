import type {
    RESTDeleteAPIChannelResult,
    RESTGetAPIChannelMessagesPinsQuery,
    RESTGetAPIChannelMessagesPinsResult,
    RESTGetAPIChannelMessagesQuery,
    RESTGetAPIChannelMessagesResult,
    RESTGetAPIChannelResult,
    RESTPatchAPIChannelJSONBody,
    RESTPatchAPIChannelResult,
    RESTPostAPIChannelMessageJSONBody,
    RESTPostAPIChannelMessageResult,
    RESTPostAPIChannelMessagesBulkDeleteJSONBody,
    RESTPostAPIChannelMessagesBulkDeleteResult,
    RESTPostAPIChannelThreadsJSONBody,
    RESTPostAPIChannelThreadsResult,
    RESTPostAPIChannelTypingResult,
} from "discord-api-types/rest";
import { Discord } from "../../..";
import { MessageAPI } from "./MessageAPI";
import type { FileResolver } from "../HTTP";

export class ChannelAPI {
    client; channel_id;
    constructor(client: Discord.Client, channel_id: string) {
        this.client = client;
        this.channel_id = channel_id;
    }

    protected get path(): string {
        return `/channels/${this.channel_id}`;
    }

    /**
     * Returns a channel object for the given id.
     * @permissions VIEW_CHANNEL (guild channel)
    * @returns Channel object {@link Discord.APIChannel}
     */
    get() {
        return this.client.http.get<ChannelAPI.Get.Result>(`${this.path}`);
    }

    /**
     * Update a channel's settings.
     * @event CHANNEL_UPDATE
     * @permissions MANAGE_CHANNELS
    * @returns Updated channel object {@link Discord.APIChannel}
     */
    modify(params: ChannelAPI.Modify.Params, reason?: string) {
        return this.client.http.patch<ChannelAPI.Modify.Result>(`${this.path}`, params, reason);
    }

    /**
     * Delete or close a channel.
     * @event CHANNEL_DELETE
     * @permissions MANAGE_CHANNELS (guild channel)
    * @returns Deleted channel object {@link Discord.APIChannel}
     */
    delete(reason?: string) {
        return this.client.http.delete<ChannelAPI.Delete.Result>(`${this.path}`, undefined, reason);
    }

    /**
     * HTTP API of channel message for the given id.
     * @param message_id
     */
    message(message_id: string) {
        return new MessageAPI(this.client, this.channel_id, message_id);
    }

    get messages() {
        return {
            /**
             * Returns the messages for a channel.
             * @permissions VIEW_CHANNEL & READ_MESSAGE_HISTORY
             * @returns List of message objects {@link Discord.APIMessage[]}
             */
            list: (query?: ChannelAPI.Message.List.Query) => {
                return this.client.http.get<ChannelAPI.Message.List.Result>(`${this.path}/messages${this.client.http.query(query)}`);
            },

            /**
             * Post a message to the channel.
             * @event MESSAGE_CREATE
             * @permissions SEND_MESSAGES (or SEND_MESSAGES_IN_THREADS for threads)
             * @returns Created message object {@link Discord.APIMessage}
             */
            create: (params: ChannelAPI.Message.Create.Params, files?: FileResolver[]) => {
                return this.client.http.fetch<ChannelAPI.Message.Create.Result>('POST', `${this.path}/messages`, params, files);
            },

            /**
             * Delete multiple messages in a single request.
             * @permissions MANAGE_MESSAGES
             * @returns Empty response (204 No Content)
             */
            bulkDelete: (params: ChannelAPI.Message.BulkDelete.Params) => {
                return this.client.http.post<ChannelAPI.Message.BulkDelete.Result>(`${this.path}/messages/bulk-delete`, params);
            }
        }
    }

    get pins() {
        return {
            /**
             * Returns paginated pinned messages for this channel.
             * @permissions VIEW_CHANNEL & READ_MESSAGE_HISTORY
             * @returns Paginated pinned messages object with `items` as {@link Discord.APIMessagePin[]} and `has_more` flag
             */
            list: (query?: ChannelAPI.Pin.List.Query) => {
                return this.client.http.get<ChannelAPI.Pin.List.Result>(`${this.path}/messages/pins${this.client.http.query(query)}`);
            }
        }
    }

    /**
     * Start a thread in this channel without a message.
     * @event THREAD_CREATE
     * @permissions CREATE_PUBLIC_THREADS or CREATE_PRIVATE_THREADS
    * @returns Created thread channel object {@link Discord.APIAnnouncementThreadChannel} or {@link Discord.APIPrivateThreadChannel} or {@link Discord.APIPublicThreadChannel}
     */
    startThread(params: ChannelAPI.StartThread.Params, reason?: string) {
        return this.client.http.post<ChannelAPI.StartThread.Result>(`${this.path}/threads`, params, reason);
    }

    /**
     * Trigger the typing indicator in this channel.
     * @permissions SEND_MESSAGES (or SEND_MESSAGES_IN_THREADS for threads)
    * @returns Empty response (204 No Content)
     */
    triggerTyping() {
        return this.client.http.post<ChannelAPI.TriggerTyping.Result>(`${this.path}/typing`, undefined);
    }
}

export namespace ChannelAPI {
    export namespace Get {
        export type Result = RESTGetAPIChannelResult;
    }

    export namespace Modify {
        export type Result = RESTPatchAPIChannelResult;
        export type Params = RESTPatchAPIChannelJSONBody;
    }

    export namespace Delete {
        export type Result = RESTDeleteAPIChannelResult;
    }

    export namespace Message {
        export namespace List {
            export type Result = RESTGetAPIChannelMessagesResult;
            export type Query = RESTGetAPIChannelMessagesQuery;
        }

        export namespace Create {
            export type Result = RESTPostAPIChannelMessageResult;
            export type Params = RESTPostAPIChannelMessageJSONBody;
        }

        export namespace BulkDelete {
            export type Result = RESTPostAPIChannelMessagesBulkDeleteResult;
            export type Params = RESTPostAPIChannelMessagesBulkDeleteJSONBody;
        }
    }

    export namespace Pin {
        export namespace List {
            export type Result = RESTGetAPIChannelMessagesPinsResult;
            export type Query = RESTGetAPIChannelMessagesPinsQuery;
        }
    }

    export namespace StartThread {
        export type Result = RESTPostAPIChannelThreadsResult;
        export type Params = RESTPostAPIChannelThreadsJSONBody;
    }

    export namespace TriggerTyping {
        export type Result = RESTPostAPIChannelTypingResult;
    }
}