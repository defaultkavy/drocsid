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
     */
    get() {
        return this.client.api.get<ChannelAPI.Get.Result>(`${this.path}`);
    }

    /**
     * Update a channel's settings.
     * @event CHANNEL_UPDATE
     * @permissions MANAGE_CHANNELS
     */
    modify(params: ChannelAPI.Modify.Params, reason?: string) {
        return this.client.api.patch<ChannelAPI.Modify.Result>(`${this.path}`, params, reason);
    }

    /**
     * Delete or close a channel.
     * @event CHANNEL_DELETE
     * @permissions MANAGE_CHANNELS (guild channel)
     */
    delete(reason?: string) {
        return this.client.api.delete<ChannelAPI.Delete.Result>(`${this.path}`, undefined, reason);
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
             */
            list: (query?: ChannelAPI.Message.List.Query) => {
                return this.client.api.get<ChannelAPI.Message.List.Result>(`${this.path}/messages${this.client.api.query(query)}`);
            },

            /**
             * Post a message to the channel.
             * @event MESSAGE_CREATE
             * @permissions SEND_MESSAGES (or SEND_MESSAGES_IN_THREADS for threads)
             */
            create: (params: ChannelAPI.Message.Create.Params) => {
                return this.client.api.post<ChannelAPI.Message.Create.Result>(`${this.path}/messages`, params);
            },

            /**
             * Delete multiple messages in a single request.
             * @permissions MANAGE_MESSAGES
             */
            bulkDelete: (params: ChannelAPI.Message.BulkDelete.Params) => {
                return this.client.api.post<ChannelAPI.Message.BulkDelete.Result>(`${this.path}/messages/bulk-delete`, params);
            }
        }
    }

    get pins() {
        return {
            /**
             * Returns paginated pinned messages for this channel.
             * @permissions VIEW_CHANNEL & READ_MESSAGE_HISTORY
             */
            list: (query?: ChannelAPI.Pin.List.Query) => {
                return this.client.api.get<ChannelAPI.Pin.List.Result>(`${this.path}/messages/pins${this.client.api.query(query)}`);
            }
        }
    }

    /**
     * Start a thread in this channel without a message.
     * @event THREAD_CREATE
     * @permissions CREATE_PUBLIC_THREADS or CREATE_PRIVATE_THREADS
     */
    startThread(params: ChannelAPI.StartThread.Params, reason?: string) {
        return this.client.api.post<ChannelAPI.StartThread.Result>(`${this.path}/threads`, params, reason);
    }

    /**
     * Trigger the typing indicator in this channel.
     * @permissions SEND_MESSAGES (or SEND_MESSAGES_IN_THREADS for threads)
     */
    triggerTyping() {
        return this.client.api.post<ChannelAPI.TriggerTyping.Result>(`${this.path}/typing`, undefined);
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