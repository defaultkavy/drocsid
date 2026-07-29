import { type APIModalSubmitInteraction, ComponentType } from "discord-api-types/payloads";
import { ModalBuilder } from "../builder/ModalBuilder";
import type { PathResolver, Prettify } from "../lib/utils";
import { Discord } from "../..";
import { ComponentBaseEvent } from "./ComponentBaseEvent";

export class ModalComponentEvent<M extends ModalBuilder = ModalBuilder, Path extends string = any> extends ComponentBaseEvent { 
    declare interaction: APIModalSubmitInteraction
    value: Map<string, string | boolean | null> = new Map();
    values: Map<string, (string | boolean | null)[]> = new Map();
    components: Prettify<M['components']> = {} as any;
    params: PathResolver<Path, string> = {} as any;
    constructor(client: Discord.Client, interaction: APIModalSubmitInteraction) {
        super(client, interaction);
        interaction.data.components
            .filter(component => component.type === ComponentType.Label)
            .forEach(label => {
                switch (label.component.type) {
                    case ComponentType.Checkbox:
                    case ComponentType.RadioGroup:
                    case ComponentType.TextInput: {
                        this.value.set(label.component.custom_id, label.component.value)
                        Object.assign(this.components, { [label.component.custom_id]: label.component.value })
                        break;
                    }
                    case ComponentType.FileUpload:
                    case ComponentType.CheckboxGroup:
                    case ComponentType.StringSelect:
                    case ComponentType.RoleSelect:
                    case ComponentType.UserSelect:
                    case ComponentType.MentionableSelect:
                    case ComponentType.ChannelSelect: {
                        this.values.set(label.component.custom_id, label.component.values);
                        Object.assign(this.components, { [label.component.custom_id]: label.component.values })
                        break;
                    }
                }
            })
    }
}