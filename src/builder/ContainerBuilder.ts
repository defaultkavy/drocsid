import { type APIComponentInContainer, type APIContainerComponent, ComponentType } from "..";
import { ComponentsBuilder, type MessageContainerComponentsBuilder } from "./MessageComponentsBuilder";

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