import { APIApplicationCommandInteraction, APIChannelSelectComponent, APICheckboxComponent, APICheckboxGroupComponent, APIComponentInLabel, APIFileUploadComponent, APILabelComponent, APIMentionableSelectComponent, APIModalInteractionResponse, APIRadioGroupComponent, APIRoleSelectComponent, APITextInputComponent, APIUserSelectComponent, ComponentType, InteractionResponseType, TextInputStyle } from "discord-api-types/payloads";
import { Discord } from "../structure/Discord";

export class ModalBuilder<Components extends Record<string, APILabelComponent> = Record<string, APILabelComponent>> {
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

    async send(client: Discord.Client, interaction: APIApplicationCommandInteraction, custom_id?: string) {
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

    shortText<K extends string>(label: string, custom_id: K, options?: Omit<APITextInputComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.TextInput,
            style: TextInputStyle.Short
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APITextInputComponent>>>;
    }

    paragraghText<K extends string>(label: string, custom_id: K, options?: Omit<APITextInputComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.TextInput,
            style: TextInputStyle.Paragraph
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APITextInputComponent>>>;
    }

    userSelect<K extends string>(label: string, custom_id: K, options?: Omit<APIUserSelectComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.UserSelect,
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APIUserSelectComponent>>>;
    }

    roleSelect<K extends string>(label: string, custom_id: K, options?: Omit<APIRoleSelectComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.RoleSelect,
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APIRoleSelectComponent>>>;
    }

    mentionableSelect<K extends string>(label: string, custom_id: K, options?: Omit<APIMentionableSelectComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.MentionableSelect,
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APIMentionableSelectComponent>>>;
    }

    channelSelect<K extends string>(label: string, custom_id: K, options?: Omit<APIChannelSelectComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.ChannelSelect,
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APIChannelSelectComponent>>>;
    }

    fileUpload<K extends string>(label: string, custom_id: K, options?: Omit<APIFileUploadComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {

        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.FileUpload,
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APIFileUploadComponent>>>;
    }

    radioGroup<K extends string>(label: string, custom_id: K, options: Omit<APIRadioGroupComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.RadioGroup,
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APIRadioGroupComponent>>>;
    }

    checkboxGroup<K extends string>(label: string, custom_id: K, options: Omit<APICheckboxGroupComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.CheckboxGroup,
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APICheckboxGroupComponent>>>;
    }

    checkbox<K extends string>(label: string, custom_id: K, options?: Omit<APICheckboxComponent, 'type' | 'style' | 'custom_id'> & Pick<APILabelComponent, 'description' | 'id'>) {
        this.config.data.components.push(this.label(label, {
            ...options,
            custom_id,
            type: ComponentType.Checkbox,
        }))
        return this as ModalBuilder<Components & Record<K, ComponentInLabel<APICheckboxComponent>>>;
    }

    modify(handle: (data: ModalModifyData<Components>) => void) {
        const data: ModalModifyData<Components> = {
            title: this.config.data.title,
            custom_id: this.config.data.custom_id,
            components: Object.fromEntries(this.config.data.components
                .filter(component => component.type === ComponentType.Label)
                .map(label => [
                    label.component.custom_id, 
                    {
                        ...structuredClone(label),
                        visible: true
                    }
                ])) as any
        };
        handle(data);
        const modal = new ModalBuilder(data.title, data.custom_id);
        modal.config = structuredClone(this.config);
        const labels = modal.config.data.components.filter(component => component.type === ComponentType.Label);
        Object.entries(data.components).forEach(([custom_id, modified]) => {
            const label = labels.find(component => component.component.custom_id === custom_id);
            if (!label) return;
            label.component.custom_id = modified.custom_id;
            label.label = modified.label;
            if (modified.visible === false) modal.config.data.components.splice(modal.config.data.components.indexOf(label), 1);
        })
        return modal;
    }

    private label(label: string, data: APIComponentInLabel & Pick<APILabelComponent, 'description' | 'id'>) {
        return {
            label, 
            description: data.description, 
            id: data.id,
            type: ComponentType.Label,
            component: data
        } satisfies APILabelComponent
    }
}

type ComponentInLabel<C extends APIComponentInLabel> = APILabelComponent & { component: C }

export type ModalModifyData<Components extends Record<string, APILabelComponent>> = {
    title: string;
    custom_id: string;
    components: {
        [key in keyof Components]: Components[key] & { visible: boolean }
    }
}