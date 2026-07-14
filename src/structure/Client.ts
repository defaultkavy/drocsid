import { ClientUserAPI } from "./api/ClientUserAPI";
import { GuildAPI } from "./api/GuildAPI";
import { UserAPI } from "./api/UserAPI";
import { Discord } from "./Discord";
import { Gateway } from "./Gateway";
import { API } from "./api/API";
import { ChannelAPI } from "./api/ChannelAPI";
import { ApplicationAPI } from "./api/ApplicationAPI";
import { GatewayReadyDispatchData } from "discord-api-types/gateway";
import { InteractionAPI } from "./api/InteractionAPI";
import { APICheckboxComponent, APIComponentInLabel, APIModalSubmitInteraction, APIRadioGroupComponent, APITextInputComponent, ComponentType, InteractionType } from "discord-api-types/payloads";
import { ModalBuilder } from "../builder/ModalBuilder";

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
            this.gateway.on(Discord.Gateway.Events.Ready, resolve)
            this.gateway.connect();
        })
    }

    on<K extends Gateway.Payload.Dispatch['t']>(type: K, listener: (data: Extract<Gateway.Payload.Dispatch, { t: K }>['d']) => void) {
        return this.gateway.on(type, listener as any);
    }

    off<K extends Gateway.Payload.Dispatch['t']>(type: K, listener: (data: Extract<Gateway.Payload.Dispatch, { t: K }>['d']) => void) {
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

    onmodal<M extends ModalBuilder>(modal: M, handle: (event: ModalEvent<M>) => void): void;
    onmodal<M extends ModalBuilder>(idMatcher: RegExp | string, handle: (event: ModalEvent<M>) => void): void;
    onmodal<M extends ModalBuilder>(resolver: RegExp | M, handle: (event: ModalEvent<M>) => void) {
        return this.on(Discord.Gateway.Events.InteractionCreate, i => {
            if (i.type !== InteractionType.ModalSubmit) return;
            if (resolver instanceof ModalBuilder) {
                if (resolver.matcher instanceof RegExp && !resolver.matcher.test(i.data.custom_id)) return;
                else if (resolver.matcher !== i.data.custom_id) return;
            }
            else if (!resolver.test(i.data.custom_id)) return;
            const data = {
                value: [] as [string, string | boolean | null][],
                values: [] as [string, (string | boolean | null)[]][],
                components: {} as Record<string, any>
            }
            i.data.components
                .filter(component => component.type === ComponentType.Label)
                .forEach(label => {
                    switch (label.component.type) {
                        case ComponentType.Checkbox:
                        case ComponentType.RadioGroup:
                        case ComponentType.TextInput: {
                            data.value.push([label.component.custom_id, label.component.value])
                            break;
                        }
                        case ComponentType.FileUpload:
                        case ComponentType.CheckboxGroup:
                        case ComponentType.StringSelect:
                        case ComponentType.RoleSelect:
                        case ComponentType.UserSelect:
                        case ComponentType.MentionableSelect:
                        case ComponentType.ChannelSelect: {
                            data.values.push([label.component.custom_id, label.component.values]);
                            break;
                        }
                    }
                })
            handle({
                interaction: i,
                value: new Map(data.value),
                values: new Map(data.values),
                components: Object.fromEntries([...data.value, ...data.values])
            });
        })
    }

    get me() {
        return new ClientUserAPI(this);
    }
}

type ModalEvent<M extends ModalBuilder> = { 
    interaction: APIModalSubmitInteraction, 
    value: Map<string, string | boolean | null>, 
    values: Map<string, (string | boolean | null)[]>,
    components: {
        [key in keyof M['components']]: ModalEventComponentValue<M['components'][key]['component']>
    }
}

type ModalEventComponentValue<Component extends APIComponentInLabel> = 
        Component extends APITextInputComponent ? string
    :   Component extends APIRadioGroupComponent ? (string | null)[]
    :   Component extends APICheckboxComponent ? boolean
    :   string[]

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
        intents?: Discord.Gateway.Intents[];
    }
}