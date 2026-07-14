import { Discord } from "../Discord";
import { CommandAPI } from "./CommandAPI";

export class GuildCommandAPI extends CommandAPI {
    guild_id;
    constructor(client: Discord.Client, application_id: string, guild_id: string, command_id: string) {
        super(client, application_id, command_id);
        this.guild_id = guild_id;
    }

    protected override get path() {
        return `/application/${this.application_id}/guilds/${this.guild_id}/commands/${this.command_id}`
    }

    /**
     * Guild-scoped command permissions for this command.
     */
    permissions() {
        return {
            /**
             * Returns command permissions for this command in the specified guild.
             * @permissions OAuth2 Bearer token with `applications.commands.permissions.update` scope
             */
            get: () => {
                return this.client.api.get<CommandAPI.Permissions.Get.Result>(`${this.path}/permissions`);
            },

            /**
             * Edits command permissions for this command in the specified guild.
             * @permissions OAuth2 Bearer token with `applications.commands.permissions.update` scope
             */
            update: (params: CommandAPI.Permissions.Update.Params) => {
                return this.client.api.put<CommandAPI.Permissions.Update.Result>(`${this.path}/permissions`, params);
            }
        };
    }
}