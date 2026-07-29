import { type APIChannelSelectComponent, type APICheckboxComponent, type APICheckboxGroupComponent, type APIComponentInLabel, type APIFileUploadComponent, type APIInteraction, type APILabelComponent, type APIMentionableSelectComponent, type APIModalInteractionResponse, type APIRadioGroupComponent, type APIRoleSelectComponent, type APITextInputComponent, type APIUserSelectComponent, ComponentType, InteractionResponseType, TextInputStyle } from "discord-api-types/payloads";
import { customIdMaxLengthCheck } from "../lib/utils";
import type { Discord } from "../..";

export class ModalBuilder<Components extends Record<string, any> = {}> {
    config: APIModalInteractionResponse;
    declare components: Components;
    matcher: RegExp | string;
    constructor(title: string, custom_id: string) {
        this.config = {
            type: InteractionResponseType.Modal,
            data: {
                components: [],
                custom_id,
                title
            }
        }

        this.matcher = custom_id;
    }

    async send(client: Discord.Client, interaction: APIInteraction, custom_id?: string) {
        const config = structuredClone(this.config);
        if (custom_id) config.data.custom_id = custom_id;
        return client.interaction(interaction.id, interaction.token).callback(config);
    }

    idMatcher(regex: RegExp) {
        this.matcher = regex;
        return this;
    }

    textDisplay(content: string, id?: number) {
        this.config.data.components.push({
            type: ComponentType.TextDisplay,
            content,
            id
        })
        return this;
    }

    shortText<K extends string, O extends ComponentOptions<APITextInputComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.TextInput,
            style: TextInputStyle.Short
        }))
        return this as ModalBuilder<Components & Record<K, string>>;
    }

    paragraghText<K extends string, O extends ComponentOptions<APITextInputComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.TextInput,
            style: TextInputStyle.Paragraph
        }))
        return this as ModalBuilder<Components & Record<K, string>>;
    }

    userSelect<K extends string, O extends ComponentOptions<APIUserSelectComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.UserSelect,
        }))
        return this as ModalBuilder<Components & Record<K, string[]>>;
    }

    roleSelect<K extends string, O extends ComponentOptions<APIRoleSelectComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.RoleSelect,
        }))
        return this as ModalBuilder<Components & Record<K, string[]>>;
    }

    mentionableSelect<K extends string, O extends ComponentOptions<APIMentionableSelectComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.MentionableSelect,
        }))
        return this as ModalBuilder<Components & Record<K, string[]>>;
    }

    channelSelect<K extends string, O extends ComponentOptions<APIChannelSelectComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.ChannelSelect,
        }))
        return this as ModalBuilder<Components & Record<K, string[]>>;
    }

    fileUpload<K extends string, O extends ComponentOptions<APIFileUploadComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.FileUpload,
        }))
        return this as ModalBuilder<Components & Record<K, string[]>>;
    }

    radioGroup<K extends string, O extends ComponentOptions<APIRadioGroupComponent>>(label: string, custom_id: K, options: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.RadioGroup,
        }))
        return this as ModalBuilder<Components & Record<K, O['required'] extends false ? null | string : string>>;
    }

    checkboxGroup<K extends string, O extends ComponentOptions<APICheckboxGroupComponent>>(label: string, custom_id: K, options: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.CheckboxGroup,
        }))
        return this as ModalBuilder<Components & Record<K, string[]>>;
    }

    checkbox<K extends string, O extends ComponentOptions<APICheckboxComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.Checkbox,
        }))
        return this as ModalBuilder<Components & Record<K, boolean>>;
    }

    private label(label: string, { description, id, ...data }: APIComponentInLabel & Pick<APILabelComponent, 'description' | 'id'>) {
        return {
            label, 
            description, 
            id,
            type: ComponentType.Label,
            component: data
        } satisfies APILabelComponent
    }
}

type LabelOptions = Pick<APILabelComponent, 'description' | 'id'>;

type ComponentOptions<T extends APIComponentInLabel> = Omit<T, 'type' | 'style' | 'custom_id'> & LabelOptions;