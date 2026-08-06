import { ClientUserAPI } from "./api/ClientUserAPI";
import { GuildAPI } from "./api/GuildAPI";
import { UserAPI } from "./api/UserAPI";
import { Gateway, type GatewayEventListener } from "./Gateway";
import { HTTP } from "./HTTP";
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
    http: HTTP;
    client: this;
    readonly id: string;
    constructor(config: Client.Config) {
        this.client = this;
        this.config = config;
        this.id = Discord.getClientIdFromToken(config.token);
        this.gateway = new Gateway(this, config.token, config.intents ?? []);
        this.http = new HTTP(this.config.token);
    }

    async connect() {
        return new Promise<GatewayReadyDispatchData>(resolve => {
            this.gateway.on('Ready', e => resolve(e.data))
            this.gateway.connect();
        })
    }

    /**
     * 
     * @param type - Event type
     * @param listener
     * @returns Function of remove listener
     */
    on<K extends keyof typeof GatewayDispatchEvents>(type: K, listener: GatewayEventListener<K>) {
        return this.gateway.on(type, listener as any);
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

    application(application_id: string = this.id) {
        return new ApplicationAPI(this, application_id);
    }

    onmodal<M extends ModalBuilder, K extends string | RegExp>(builder: ModalBuilderResolver<M> | undefined, custom_id: K, handle: ModalEventListener<M, K>) {
        return this.on('InteractionCreate', ({data}) => {
            if (data.type !== InteractionType.ModalSubmit) return;
            if (custom_id instanceof RegExp && !custom_id.test(data.data.custom_id)) return;

            const event = new ModalComponentEvent<M>(this, data);
            if (typeof custom_id === 'string') {
                if (!this.customIdResolver(custom_id, data, event)) return;
            }
            
            handle(event);
        })
    }

    oncomponent<T extends keyof typeof Discord.ComponentType, K extends string | RegExp>(type: T, custom_id: K, handle: ComponentEventListener<T, K>) {
        return this.on('InteractionCreate', ({data}) => {
            if (data.type !== InteractionType.MessageComponent) return;
            if (data.data.component_type !== Discord.ComponentType[type]) return;
            if (custom_id instanceof RegExp && !custom_id.test(data.data.custom_id)) return;

            const event = new MessageComponentEvent<any, any>(this, data);
            if (typeof custom_id === 'string') {
                if (!this.customIdResolver(custom_id, data, event)) return;
            }

            handle(event);
        })
    }

    customIdResolver(custom_id: string, i: APIMessageComponentInteraction | APIModalSubmitInteraction, event: MessageComponentEvent | ModalComponentEvent) {
        const log = logger.prefix('customIdResolver()')
        log.debug(`resolving custom_id (${custom_id})`, i.data.custom_id)
        const resolveParts = custom_id.split('/');
        const requestParts = i.data.custom_id.split('/');
        for (let i = 0; i < resolveParts.length; i++) {
            const resPart = resolveParts[i];
            if (!resPart) throw log.fatal('resPart is undefined');
            const reqPart = requestParts[i];
            const matched = resPart.match(/{(.+?)}/);
            if (matched) {
                const paramName = matched[1]!;
                if (!paramName.endsWith('?') && !reqPart) return false;
                log.debug(`params matched (${matched[1]}: ${reqPart})`)
                Object.assign(event.params, {[matched[1]!.replace(/\?$/, '')]: reqPart});
            }
            else if (reqPart !== resPart) return false;
        }
        log.debug(`custom id matched (${custom_id})`)
        return true;
    }

    get me() {
        return new ClientUserAPI(this);
    }
}

export type ModalEventListener<M extends ModalBuilder = any, K extends string | RegExp = any> = (event: ModalComponentEvent<M, K extends string ? K : ''>) => void;
export type ModalBuilderResolver<M> = M | ((...args: any[]) => M) | ((...args: any[]) => Promise<M>);

export type ComponentEventListener<T extends keyof typeof Discord.ComponentType = any, K extends string | RegExp = any> = (event: MessageComponentEvent<Extract<APIMessageComponentInteractionData, { component_type: typeof Discord.ComponentType[T] }>, K extends string ? K : ''>) => void;

export namespace Client {
    export namespace User {
        export import API = ClientUserAPI;
    }
    export interface Base {
        client: Discord.Client;
    }
    export interface Config {
        token: string;
        intents?: (keyof typeof Discord.GatewayIntentBits)[];
    }
}