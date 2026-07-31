import { type APIAttachment, type APIChannelSelectComponent, type APICheckboxComponent, type APICheckboxGroupComponent, type APIComponentInLabel, type APIFileUploadComponent, type APIInteraction, type APIInteractionDataResolvedChannel, type APIInteractionDataResolvedGuildMember, type APILabelComponent, type APIMentionableSelectComponent, type APIModalInteractionResponse, type APIRadioGroupComponent, type APIRole, type APIRoleSelectComponent, type APITextInputComponent, type APIUser, type APIUserSelectComponent, ComponentType, InteractionResponseType, TextInputStyle } from "discord-api-types/payloads";
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

    use(handle: (components: this) => this) {
        handle(this);
        return this;
    }

    if<T extends ModalBuilder>(condition: boolean, handle: (builder: ModalBuilder) => T) {
        if (condition) handle(this);
        return this as unknown as ModalBuilder<Components & PartialComponents<T>>;
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
        return this as ModalBuilder<Components & Record<K, Map<string, { user: APIUser, member?: APIInteractionDataResolvedGuildMember }>>>;
    }

    roleSelect<K extends string, O extends ComponentOptions<APIRoleSelectComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.RoleSelect,
        }))
        return this as ModalBuilder<Components & Record<K, Map<string, APIRole>>>;
    }

    channelSelect<K extends string, O extends ComponentOptions<APIChannelSelectComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.ChannelSelect,
        }))
        return this as ModalBuilder<Components & Record<K, Map<string, APIInteractionDataResolvedChannel>>>;
    }

    mentionableSelect<K extends string, O extends ComponentOptions<APIMentionableSelectComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.MentionableSelect,
        }))
        return this as ModalBuilder<Components & Record<K, MentionableMap>>;
    }

    fileUpload<K extends string, O extends ComponentOptions<APIFileUploadComponent>>(label: string, custom_id: K, options?: O) {
        customIdMaxLengthCheck(custom_id);
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.FileUpload,
        }))
        return this as ModalBuilder<Components & Record<K, Map<string, APIAttachment>>>;
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

type PartialComponents<T extends ModalBuilder> = {
    [key in keyof T['components']]?: T['components'][key]
}

export type MentionableMap = {
    members: Map<string, APIInteractionDataResolvedGuildMember>,
    users: Map<string, APIUser>,
    roles: Map<string, APIRole>
}