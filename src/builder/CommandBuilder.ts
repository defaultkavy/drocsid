import { ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } from "discord-api-types/payloads";
import { Locale, type RESTPostAPIBaseApplicationCommandsJSONBody } from "discord-api-types/rest";

export abstract class CommandBuilder {
    abstract config: RESTPostAPIBaseApplicationCommandsJSONBody;

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
}

export type PermissionFlagsBits = keyof typeof PermissionFlagsBits;