import type {
    RESTDeleteAPIInteractionFollowupResult,
    RESTDeleteAPIInteractionOriginalResponseResult,
    RESTGetAPIInteractionFollowupResult,
    RESTGetAPIInteractionOriginalResponseResult,
    RESTPatchAPIInteractionFollowupJSONBody,
    RESTPatchAPIInteractionFollowupResult,
    RESTPatchAPIInteractionOriginalResponseJSONBody,
    RESTPatchAPIInteractionOriginalResponseResult,
    RESTPostAPIInteractionCallbackJSONBody,
    RESTPostAPIInteractionCallbackWithResponseResult,
    RESTPostAPIInteractionFollowupJSONBody,
    RESTPostAPIInteractionFollowupResult
} from "discord-api-types/rest";
import type { Discord } from "../../..";

export class InteractionAPI {
    client: Discord.Client;
    interaction_id: string;
    interaction_token: string;

    constructor(client: Discord.Client, interaction_id: string, interaction_token: string) {
        this.client = client;
        this.interaction_id = interaction_id;
        this.interaction_token = interaction_token;
    }

    protected get path(): string {
        return `/interactions/${this.interaction_id}/${this.interaction_token}`;
    }

    protected get webhookPath(): string {
        return `/webhooks/${this.client.config.client_id}/${this.interaction_token}`;
    }

    /**
     * Create an interaction response.
     * @event Cannot be followed by more than one interaction response or followup message within a 5 minute window.
     */
    callback(params: InteractionAPI.Callback.Params) {
        return this.client.api.post<InteractionAPI.Callback.Result>(`${this.path}/callback?with_response=true`, params);
    }

    get originalResponse() {
        return {
            /**
             * Returns the initial interaction response.
             */
            get: () => {
                return this.client.api.get<InteractionAPI.OriginalResponse.Get.Result>(
                    `${this.webhookPath}/messages/@original`
                );
            },

            /**
             * Edits the initial interaction response.
             * @event New token expires 15 minutes from the original request.
             */
            edit: (params: InteractionAPI.OriginalResponse.Edit.Params) => {
                return this.client.api.patch<InteractionAPI.OriginalResponse.Edit.Result>(
                    `${this.webhookPath}/messages/@original`, params
                );
            },

            /**
             * Deletes the initial interaction response.
             */
            delete: () => {
                return this.client.api.delete<InteractionAPI.OriginalResponse.Delete.Result>(
                    `${this.webhookPath}/messages/@original`
                );
            }
        };
    }

    /**
     * Creates a followup message for an interaction.
     */
    followup(params: InteractionAPI.Followup.Create.Params) {
        return this.client.api.post<InteractionAPI.Followup.Create.Result>(
            `${this.webhookPath}`, params
        );
    }

    /**
     * Access a specific followup message.
     * @param message_id
     */
    followupMessage(message_id: string) {
        const messagePath = `${this.webhookPath}/messages/${message_id}`;
        return {
            /**
             * Returns a followup message for an interaction.
             */
            get: () => {
                return this.client.api.get<InteractionAPI.FollowupMessage.Get.Result>(messagePath);
            },

            /**
             * Edits a followup message.
             * @event New token expires 15 minutes from the original request.
             */
            edit: (params: InteractionAPI.FollowupMessage.Edit.Params) => {
                return this.client.api.patch<InteractionAPI.FollowupMessage.Edit.Result>(messagePath, params);
            },

            /**
             * Deletes a followup message.
             */
            delete: () => {
                return this.client.api.delete<InteractionAPI.FollowupMessage.Delete.Result>(messagePath);
            }
        };
    }
}

export namespace InteractionAPI {
    export namespace Callback {
        export type Result = RESTPostAPIInteractionCallbackWithResponseResult;
        export type Params = RESTPostAPIInteractionCallbackJSONBody;
    }

    export namespace OriginalResponse {
        export namespace Get {
            export type Result = RESTGetAPIInteractionOriginalResponseResult;
        }

        export namespace Edit {
            export type Result = RESTPatchAPIInteractionOriginalResponseResult;
            export type Params = RESTPatchAPIInteractionOriginalResponseJSONBody;
        }

        export namespace Delete {
            export type Result = RESTDeleteAPIInteractionOriginalResponseResult;
        }
    }

    export namespace Followup {
        export namespace Create {
            export type Result = RESTPostAPIInteractionFollowupResult;
            export type Params = RESTPostAPIInteractionFollowupJSONBody;
        }
    }

    export namespace FollowupMessage {
        export namespace Get {
            export type Result = RESTGetAPIInteractionFollowupResult;
        }

        export namespace Edit {
            export type Result = RESTPatchAPIInteractionFollowupResult;
            export type Params = RESTPatchAPIInteractionFollowupJSONBody;
        }

        export namespace Delete {
            export type Result = RESTDeleteAPIInteractionFollowupResult;
        }
    }
}