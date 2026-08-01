import { type APIModalSubmitInteraction, ComponentType } from "discord-api-types/payloads";
import { ModalBuilder, type MentionableMap } from "../builder/ModalBuilder";
import type { PathResolver, Prettify } from "../lib/utils";
import { Discord } from "../..";
import { ComponentBaseEvent } from "./ComponentBaseEvent";

export class ModalComponentEvent<M extends ModalBuilder = ModalBuilder, Path extends string = any, I extends APIModalSubmitInteraction = APIModalSubmitInteraction> extends ComponentBaseEvent<I> { 
    value: Map<string, string | boolean | null> = new Map();
    values: Map<string, string[]> = new Map();
    data: Prettify<M['components']> = {} as any;
    params: PathResolver<Path, string> = {} as any;
    constructor(client: Discord.Client, interaction: I) {
        super(client, interaction);
        interaction.data.components
            .filter(component => component.type === ComponentType.Label)
            .forEach(label => {
                switch (label.component.type) {
                    case ComponentType.Checkbox:
                    case ComponentType.RadioGroup:
                    case ComponentType.TextInput: 
                        this.value.set(label.component.custom_id, label.component.value)
                        Object.assign(this.data, { [label.component.custom_id]: label.component.value })
                        break;
                    case ComponentType.CheckboxGroup:
                    case ComponentType.StringSelect:
                        this.values.set(label.component.custom_id, label.component.values);
                        Object.assign(this.data, { [label.component.custom_id]: label.component.values })
                        break;
                    case ComponentType.FileUpload:
                    case ComponentType.UserSelect:
                    case ComponentType.RoleSelect:
                    case ComponentType.ChannelSelect: 
                        const map = new Map()
                        for (const resolveId of label.component.values) {
                            const resolved = this.interaction.data.resolved?.[
                                label.component.type === ComponentType.UserSelect ? 'users'
                                : label.component.type === ComponentType.RoleSelect ? 'roles'
                                : label.component.type === ComponentType.FileUpload ? 'attachments' : 'channels'
                            ]?.[resolveId];
                            if (resolved) map.set(resolveId, resolved);
                        }
                        this.values.set(label.component.custom_id, label.component.values);
                        Object.assign(this.data, { [label.component.custom_id]: map });
                        break;
                    
                    case ComponentType.MentionableSelect: {
                        const value: MentionableMap = { users: new Map(), roles: new Map(), members: new Map() }
                        for (const resolveId of label.component.values) {
                            const user = this.interaction.data.resolved?.users?.[resolveId];
                            const role = this.interaction.data.resolved?.roles?.[resolveId];
                            const member = this.interaction.data.resolved?.members?.[resolveId];
                            if (user) value.users.set(resolveId, user);
                            if (role) value.roles.set(resolveId, role);
                            if (member) value.members.set(resolveId, member);
                        }
                        this.values.set(label.component.custom_id, label.component.values);
                        Object.assign(this.data, { [label.component.custom_id]: value });
                        break;
                    }
                }
            })
    }
}