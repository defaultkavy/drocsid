import { Locale, RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord-api-types/rest";
import { CommandBuilder, CommandEvent } from "./CommandBuilder";
import { APIMessage, APIMessageApplicationCommandInteraction, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } from "discord-api-types/payloads";
import { Discord } from "../structure/Discord";

export class MessageCommandBuilder extends CommandBuilder {
    listeners = new Set<(i: MessageCommandEvent) => void>();
    config: RESTPostAPIContextMenuApplicationCommandsJSONBody;
    constructor(name: string) {
        super();
        this.config = {
            name,
            type: ApplicationCommandType.Message,
            name_localizations: {},
            description_localizations: {}
        }
    }

    contexts(contexts: InteractionContextType[]) {
        this.config.contexts = contexts;
        return this;
    }

    integrationTypes(types: ApplicationIntegrationType[]) {
        this.config.integration_types = types
        return this;
    }

    setNameLocalization(locale: Locale, name: string) {
        this.config.name_localizations![locale] = name;
        return this;
    }

    setDescriptionLocalization(locale: Locale, description: string) {
        this.config.description_localizations![locale] = description;
        return this;
    }

    nsfw(nsfw: boolean) {
        this.config.nsfw = nsfw;
        return this;
    }

    defaultMemberPermissions(permissions: PermissionFlagsBits[]) {
        this.config.default_member_permissions = permissions.reduce((prev, value) => prev + PermissionFlagsBits[value], BigInt(0)).toString();
        return this;
    }

    oncall(handle: (i: MessageCommandEvent) => void) {
        this.listeners.add(handle);
        return this;
    }
}

export type PermissionFlagsBits = keyof typeof PermissionFlagsBits;

export class MessageCommandEvent extends CommandEvent {
    declare interaction: APIMessageApplicationCommandInteraction;
    message: APIMessage;
    constructor(client: Discord.Client, interaction: APIMessageApplicationCommandInteraction) {
        super(client, interaction);
        this.message = Object.entries(interaction.data.resolved.messages)[0]![1]!
    }
}