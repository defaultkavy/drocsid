import { type APIComponentInContainer, type APIFileComponent, type APIMediaGalleryComponent, type APIMediaGalleryItem, type APIMessageComponent, type APIMessageTopLevelComponent, type APISectionAccessoryComponent, type APISeparatorComponent, type APITextDisplayComponent, type APIUnfurledMediaItem, ComponentType } from "discord-api-types/payloads";
import { AccessoryBuilder } from "./AccessoryBuilder";
import { ActionRowBuilder } from "./ActionRowBuilder";
import { ContainerBuilder } from "./ContainerBuilder";

export class ComponentsBuilder<T> {
    components: APIMessageComponent[] = [];
    constructor() {}

    use(handle: (components: this) => this) {
        handle(this);
        return this;
    }

    if(condition: boolean, handle: (builder: T) => void) {
        if (condition) handle(this as unknown as T);
        return this as unknown as T;
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

export interface MessageContainerSectionComponentsBuilder extends Pick<ComponentsBuilder<MessageContainerSectionComponentsBuilder>, 'textDisplay' | 'if' | 'use'> {
    components: APITextDisplayComponent[];
}

type SectionOptions = { 
    texts: (Omit<APITextDisplayComponent, 'type'> | string)[];
    accessory: ((builder: typeof AccessoryBuilder) => APISectionAccessoryComponent) | APISectionAccessoryComponent
}