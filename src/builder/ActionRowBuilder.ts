import { type APIActionRowComponent, type APIButtonComponentBase, type APIChannelSelectComponent, type APIComponentInMessageActionRow, type APILabelComponent, type APIMentionableSelectComponent, type APIRoleSelectComponent, type APIStringSelectComponent, type APIUserSelectComponent, ButtonStyle, ComponentType } from "..";
import { customIdMaxLengthCheck } from "../lib/utils";
import { ButtonBuilder } from "./ButtonBuilder";

export class ActionRowBuilder {
    config: APIActionRowComponent<APIComponentInMessageActionRow>;
    constructor() {
        this.config = {
            components: [],
            type: ComponentType.ActionRow
        }
    }

    use(handle: (components: this) => this) {
        handle(this);
        return this;
    }

    if(condition: boolean, handle: (builder: this) => this) {
        if (condition) handle(this);
        return this;
    }

    id(id: number) {
        this.config.id = id;
        return this;
    }

    primaryButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Primary>, 'type' | 'style' | 'custom_id'>) {
        this.config.components.push(ButtonBuilder.primaryButton(custom_id, options));
        return this;
    }

    secondaryButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Secondary>, 'type' | 'style' | 'custom_id'>) {
        this.config.components.push(ButtonBuilder.secondaryButton(custom_id, options));
        return this;
    }

    successButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Success>, 'type' | 'style' | 'custom_id'>) {
        this.config.components.push(ButtonBuilder.successButton(custom_id, options));
        return this;
    }

    dangerButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Danger>, 'type' | 'style' | 'custom_id'>) {
        this.config.components.push(ButtonBuilder.dangerButton(custom_id, options));
        return this;
    }

    linkButton(url: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Link>, 'type' | 'style' | 'custom_id'>) {
        this.config.components.push(ButtonBuilder.linkButton(url, options));
        return this;
    }
    
    userSelect<K extends string>(custom_id: K, options?: Omit<APIUserSelectComponent, 'type' | 'style' | 'custom_id' | 'required'> & Pick<APILabelComponent, 'description' | 'id'>) {
        customIdMaxLengthCheck(custom_id);
        this.config.components.push({
            custom_id,
            type: ComponentType.UserSelect,
            ...options
        })
        return this;
    }
    
    roleSelect<K extends string>(custom_id: K, options?: Omit<APIRoleSelectComponent, 'type' | 'style' | 'custom_id' | 'required'> & Pick<APILabelComponent, 'description' | 'id'>) {
        customIdMaxLengthCheck(custom_id);
        this.config.components.push({
            custom_id,
            type: ComponentType.RoleSelect,
            ...options
        })
        return this;
    }
    
    channelSelect<K extends string>(custom_id: K, options?: Omit<APIChannelSelectComponent, 'type' | 'style' | 'custom_id' | 'required'> & Pick<APILabelComponent, 'description' | 'id'>) {
        customIdMaxLengthCheck(custom_id);
        this.config.components.push({
            custom_id,
            type: ComponentType.ChannelSelect,
            ...options
        })
        return this;
    }
    
    mentionableSelect<K extends string>(custom_id: K, options?: Omit<APIMentionableSelectComponent, 'type' | 'style' | 'custom_id' | 'required'> & Pick<APILabelComponent, 'description' | 'id'>) {
        customIdMaxLengthCheck(custom_id);
        this.config.components.push({
            custom_id,
            type: ComponentType.MentionableSelect,
            ...options
        })
        return this;
    }
    
    stringSelect<K extends string>(custom_id: K, options: Omit<APIStringSelectComponent, 'type' | 'style' | 'custom_id' | 'required'> & Pick<APILabelComponent, 'description' | 'id'>) {
        customIdMaxLengthCheck(custom_id);
        this.config.components.push({
            custom_id,
            type: ComponentType.StringSelect,
            ...options
        })
        return this;
    }
}