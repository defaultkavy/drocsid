import { type APIActionRowComponent, type APIButtonComponentBase, type APIChannelSelectComponent, type APIComponentInContainer, type APIComponentInMessageActionRow, type APIContainerComponent, type APIFileComponent, type APILabelComponent, type APIMediaGalleryComponent, type APIMediaGalleryItem, type APIMentionableSelectComponent, type APIMessageComponent, type APIMessageTopLevelComponent, type APIRoleSelectComponent, type APISectionAccessoryComponent, type APISeparatorComponent, type APIStringSelectComponent, type APITextDisplayComponent, type APIThumbnailComponent, type APIUnfurledMediaItem, type APIUserSelectComponent, ButtonStyle, ComponentType } from "discord-api-types/payloads";
import { customIdMaxLengthCheck } from "../lib/utils";

export class ComponentsBuilder<T> {
    components: APIMessageComponent[] = [];
    constructor() {}

    use(handle: (components: this) => this) {
        handle(this);
        return this;
    }

    if(condition: boolean, handle: () => void) {
        if (condition) handle();
        return this;
    }

    actionRow(handle: (actionRow: ActionRowBuilder) => void) {
        const builder = new ActionRowBuilder();
        handle(builder);
        this.components.push(builder.config);
        return this as unknown as T;
    }

    section(options: SectionOptions) {
        this.components.push({
            type: ComponentType.Section,
            components: options.texts.map(resolver => ({
                type: ComponentType.TextDisplay, 
                ...(typeof resolver === 'string' ? { content: resolver } : resolver)
            })),
            accessory: options.accessory instanceof Function ? options.accessory(AccessoryBuilder) : options.accessory
        })
        return this as unknown as T;
    }

    textDisplay(content: string, options?: Omit<APITextDisplayComponent, 'type' | 'content'>) {
        this.components.push({
            type: ComponentType.TextDisplay,
            content,
            ...options
        })
        return this as unknown as T;
    }

    mediaGallery(items: (string | APIUnfurledMediaItem & Omit<APIMediaGalleryItem, 'media'>)[], options?: Omit<APIMediaGalleryComponent, 'type' | 'items'>) {
        this.components.push({
            type: ComponentType.MediaGallery,
            items: items.map(resolver => {
                if (typeof resolver === 'string') return { media: {url: resolver}}
                else {
                    const { description, spoiler, ...media } = resolver;
                    return { media: media, description, spoiler } satisfies APIMediaGalleryItem;
                }
            }),
            ...options
        })
        return this as unknown as T;
    }

    file(url: string, options?: Omit<APIFileComponent, 'type' | 'file'> & Omit<APIUnfurledMediaItem, 'url'>) {
        const { id, spoiler, name, size, ...file } = options ?? {};
        this.components.push({
            type: ComponentType.File,
            id, spoiler, name, size,
            file: {
                url,
                ...file
            }
        })
        return this as unknown as T;
    }

    separator(options?: Omit<APISeparatorComponent, 'type'>) {
        this.components.push({
            type: ComponentType.Separator,
            ...options
        })
        return this as unknown as T;
    }


    container(builder: ContainerBuilder): T
    container(handle: (builder: ContainerBuilder) => ContainerBuilder): T
    container(resolver: ContainerBuilder | ((builder: ContainerBuilder) => ContainerBuilder)) {
        if (resolver instanceof Function) resolver = resolver(new ContainerBuilder());
        this.components.push(resolver.config);
        return this as unknown as T;
    }
}

export interface MessageComponentsBuilder extends Omit<ComponentsBuilder<MessageComponentsBuilder>, 'components'> {
    components: APIMessageTopLevelComponent[];
}

export interface MessageContainerComponentsBuilder extends Omit<ComponentsBuilder<MessageContainerComponentsBuilder>, 'components' | 'container'> {
    components: APIComponentInContainer[];
}

type SectionOptions = { 
    texts: (string | Omit<APITextDisplayComponent, 'type'>)[];
    accessory: ((builder: typeof AccessoryBuilder) => APISectionAccessoryComponent) | APISectionAccessoryComponent
}

export class ActionRowBuilder {
    config: APIActionRowComponent<APIComponentInMessageActionRow>;
    constructor() {
        this.config = {
            components: [],
            type: ComponentType.ActionRow
        }
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

export class ButtonBuilder {

    static primaryButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Primary>, 'type' | 'style' | 'custom_id'>) {
        customIdMaxLengthCheck(custom_id);
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            custom_id,
            ...options
        } as const;
    }

    static secondaryButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Secondary>, 'type' | 'style' | 'custom_id'>) {
        customIdMaxLengthCheck(custom_id);
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Secondary,
            custom_id,
            ...options
        } as const;
    }

    static successButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Success>, 'type' | 'style' | 'custom_id'>) {
        customIdMaxLengthCheck(custom_id);
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Success,
            custom_id,
            ...options
        } as const;
    }

    static dangerButton(custom_id: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Danger>, 'type' | 'style' | 'custom_id'>) {
        customIdMaxLengthCheck(custom_id);
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Danger,
            custom_id,
            ...options
        } as const;
    }

    static linkButton(url: string, options?: Omit<APIButtonComponentBase<ButtonStyle.Link>, 'type' | 'style' | 'custom_id'>) {
        return {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url,
            ...options
        } as const;
    }
}

export class AccessoryBuilder extends ButtonBuilder {
    static thumbnail(url: string, options?: Omit<APIThumbnailComponent, 'type' | 'file'> & Omit<APIUnfurledMediaItem, 'url'>) {
        const { id, spoiler, ...file } = options ?? {};
        return {
            type: ComponentType.Thumbnail,
            id, spoiler, 
            media: {
                url,
                ...file
            }
        } satisfies APIThumbnailComponent;
    }
}

export class ContainerBuilder {
    config: APIContainerComponent;
    constructor() {
        this.config = {
            type: ComponentType.Container,
            components: [],
        }
    }

    accentColor(color: number | null) {
        this.config.accent_color = color;
        return this;
    }

    id(id: number) {
        this.config.id = id;
        return this;
    }

    spoiler(enable: boolean) {
        this.config.spoiler = enable;
        return this;
    }


    components(handle: ((builder: MessageContainerComponentsBuilder) => MessageContainerComponentsBuilder)): this
    components(builder: MessageContainerComponentsBuilder): this
    components(resolver: APIComponentInContainer[]): this
    components(resolver: APIComponentInContainer[] | MessageContainerComponentsBuilder | ((builder: MessageContainerComponentsBuilder) => MessageContainerComponentsBuilder)) {
        if (resolver instanceof Array) this.config.components = resolver;
        else if (resolver instanceof Function) this.config.components = resolver(new ComponentsBuilder() as unknown as MessageContainerComponentsBuilder).components;
        else this.config.components = resolver.components;
        return this;
    }
}