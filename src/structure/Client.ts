import { ClientUserAPI } from "./api/ClientUserAPI";
import { GuildAPI } from "./api/GuildAPI";
import { UserAPI } from "./api/UserAPI";
import { Gateway } from "./Gateway";
import { API } from "./api/API";
import { ChannelAPI } from "./api/ChannelAPI";
import { ApplicationAPI } from "./api/ApplicationAPI";
import type { GatewayDispatchEvents, GatewayReadyDispatchData } from "discord-api-types/gateway";
import { InteractionAPI } from "./api/InteractionAPI";
import { InteractionType, type APIMessageComponentInteraction, type APIMessageComponentInteractionData, type APIModalSubmitInteraction } from "discord-api-types/payloads";
import { ModalBuilder } from "../builder/ModalBuilder";
import { ModalComponentEvent } from "../event/ModalComponentEvent";
import { MessageComponentEvent } from "../event/MessageComponentEvent";
import { Discord } from "../..";
import { loggerMap } from "../lib/logger";

const logger = loggerMap.client;

/**
 * Discord client instance. Provide the HTTP API methods and Discord Gateway interface.
 */
export class Client {
    config: Client.Config;
    gateway: Gateway;
    api: API;
    client: this;
    constructor(config: Client.Config) {
        this.client = this;
        this.config = config;
        this.gateway = new Gateway(this, config.client_token, config.intents ?? []);
        this.api = new API(this.config.client_token);
    }

    async connect() {
        return new Promise<GatewayReadyDispatchData>(resolve => {
            this.gateway.on('Ready', resolve)
            this.gateway.connect();
        })
    }

    on<K extends keyof typeof GatewayDispatchEvents>(type: K, listener: (data: Extract<Gateway.Payload.Dispatch, { t: typeof GatewayDispatchEvents[K] }>['d']) => void) {
        return this.gateway.on(type, listener as any);
    }

    off<K extends keyof typeof GatewayDispatchEvents>(type: K, listener: (data: Extract<Gateway.Payload.Dispatch, { t: typeof GatewayDispatchEvents[K] }>['d']) => void) {
        this.gateway.off(type, listener as any)
    }

    /**
     * HTTP API of guild for the given id.
     * @param guild_id
     */
    guild(guild_id: string) {
        return new GuildAPI(this, guild_id);
    }

    /**
     * HTTP API of user for the given id.
     * @param user_id
     */
    user(user_id: string) {
        return new UserAPI(this, user_id);
    }

    channel(channel_id: string) {
        return new ChannelAPI(this, channel_id);
    }

    interaction(interaction_id: string, token: string) {
        return new InteractionAPI(this, interaction_id, token);
    }

    application(application_id: string = this.client.config.client_id) {
        return new ApplicationAPI(this, application_id);
    }

    onmodal<K extends string | RegExp, M extends ModalBuilder>(builder: M | ((...args: any[]) => M) | ((...args: any[]) => Promise<M>), custom_id: K, handle: (event: ModalComponentEvent<M, K extends string ? K : ''>) => void) {
        return this.on('InteractionCreate', i => {
            if (i.type !== InteractionType.ModalSubmit) return;
            if (custom_id instanceof RegExp && !custom_id.test(i.data.custom_id)) return;

            const event = new ModalComponentEvent<M>(this, i);
            if (typeof custom_id === 'string') {
                if (!this.customIdResolver(custom_id, i, event)) return;
            }
            
            handle(event);
        })
    }

    oncomponent<T extends keyof typeof Discord.ComponentType, K extends string | RegExp>(type: T, custom_id: K, handle: (event: MessageComponentEvent<Extract<APIMessageComponentInteractionData, { component_type: typeof Discord.ComponentType[T] }>, K extends string ? K : ''>) => void) {
        return this.on('InteractionCreate', i => {
            if (i.type !== InteractionType.MessageComponent) return;
            if (i.data.component_type !== Discord.ComponentType[type]) return;
            if (custom_id instanceof RegExp && !custom_id.test(i.data.custom_id)) return;

            const event = new MessageComponentEvent<any, any>(this, i);
            if (typeof custom_id === 'string') {
                if (!this.customIdResolver(custom_id, i, event)) return;
            }

            handle(event);
        })
    }

    customIdResolver(custom_id: string, i: APIMessageComponentInteraction | APIModalSubmitInteraction, event: MessageComponentEvent | ModalComponentEvent) {
        const log = logger.prefix('customIdResolver()')
        log.debug(`resolving custom_id (${custom_id})`)
        const resolveParts = custom_id.split('/');
        const requestParts = i.data.custom_id.split('/');
        for (let i = 0; i < resolveParts.length; i++) {
            const resPart = resolveParts[i];
            if (!resPart) throw log.fatal('resPart is undefined');
            const reqPart = requestParts[i];
            if (!reqPart) return false;
            const matched = resPart.match(/{(.+?)}/);
            if (matched) {
                log.debug(`custom_id matched (${matched[1]}: ${reqPart})`)
                Object.assign(event.params, {[matched[1]!]: reqPart});
            }
            else if (reqPart !== resPart) return false;
        }
        return true;
    }

    get me() {
        return new ClientUserAPI(this);
    }
}

export namespace Client {
    export namespace User {
        export import API = ClientUserAPI;
    }
    export interface Base {
        client: Discord.Client;
    }
    export interface Config {
        client_id: string;
        client_token: string;
        intents?: (keyof typeof Discord.GatewayIntentBits)[];
    }
}