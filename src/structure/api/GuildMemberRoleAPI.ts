import { Discord } from "../Discord";

export class GuildMemberRoleAPI {
    client; guild_id; user_id;
    role_id: string;
    constructor(client: Discord.Client, guild_id: string, user_id: string, role_id: string) {
        this.client = client;
        this.guild_id = guild_id;
        this.user_id = user_id;
        this.role_id = role_id;
    }

    add() {
        return this.client.api.put<void>(`/guilds/${this.guild_id}/members/${this.user_id}/roles/${this.role_id}`)
    }

    remove() {
        return this.client.api.delete<void>(`/guilds/${this.guild_id}/members/${this.user_id}/roles/${this.role_id}`)
    }
}