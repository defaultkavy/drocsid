import { ChannelType, PermissionFlagsBits, type APIBasePartialChannel, type APIGuildChannel, type APIGuildMember, type APIUser } from 'discord-api-types/payloads';
import { logger } from './lib/logger';
import type { Client } from './structure/Client';

export * from 'discord-api-types/payloads';
export * from 'discord-api-types/gateway';
export * as Event from './event';
export * as Builder from './builder';
export { type MentionableMap } from './builder/ModalBuilder'
export * as API from './structure/api';
export { Client } from './structure/Client';
export { Gateway } from './structure/Gateway';
export { Guild } from './structure/Guild';
export { HTTP } from './structure/HTTP';

export type PermissionFlagsBitsName = keyof typeof PermissionFlagsBits;

export function setLogLevel(level: 0 | 1 | 2 | 3) {
    logger.level = level;
}

export type AvatarSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export function defaultAvatarURL(user: Pick<APIUser, 'discriminator' | 'id'>) {
    const index = !user.discriminator || user.discriminator === '0' 
        ?   Number((BigInt(user.id) >> 22n) % 6n)
        :   Number(user.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export function avatarURL({ user, member, size }: { user: Pick<APIUser, 'discriminator' | 'id' | 'avatar'>, member?: Pick<APIGuildMember, 'avatar' | 'user'>, size?: AvatarSizes }) {
    const avatarId = member?.avatar ?? user.avatar;
    if (!avatarId) return defaultAvatarURL(user);
    return `https://cdn.discordapp.com/avatars/${user.id}/${avatarId}.${avatarId.startsWith('a_') ? 'gif' : 'png'}?size=${size ?? 512}`
}

export function hasPermission(app_permissions: string | bigint, ...permissions: PermissionFlagsBitsName[]) {
    app_permissions = BigInt(app_permissions);
    if ((app_permissions & PermissionFlagsBits.Administrator) !== 0n) return true; 
    return permissions.every(permission => (app_permissions & PermissionFlagsBits[permission]) !== 0n)
}

const AllPermissionsFlagBits = (1n << 53n) - 1n;
export async function getUserPermissions(client: Client, { guild_id, user_id, channel_id }: { guild_id: string, user_id?: string, channel_id?: string }) {
    user_id = user_id ?? client.me.user_id;
    const log = logger.prefix('getUserChannelPermissionsOverwrite()');

    const [guild, roles, member] = await Promise.all([
        client.guild(guild_id).get(),
        client.guild(guild_id).roles.list().then(roles => new Map(roles.map(role => [role.id, role]))),
        client.guild(guild_id).member(user_id).get()
    ])

    if (guild.owner_id === user_id) return AllPermissionsFlagBits;

    const everyoneRole = roles.get(guild_id);
    if (!everyoneRole) throw log.error(`everyoneRole is undefined`);
    let permissions = BigInt(everyoneRole.permissions);

    for (const roleId of member.roles) {
        const role = roles.get(roleId);
        if (!role) continue;
        permissions |= BigInt(role.permissions);
    }

    if (hasPermission(permissions, 'Administrator')) return AllPermissionsFlagBits;
    if (!channel_id) return permissions;

    const overwrites = await client.channel(channel_id).get().then(channel => {
        if (!isGuildChannel(channel)) throw log.error(`not a guild channel (${channel_id})`);
        return new Map(channel.permission_overwrites?.map(overwrites => [overwrites.id, overwrites]));
    })

    const everyoneOverwrites = overwrites.get(guild_id);
    if (everyoneOverwrites) {
        permissions &= ~BigInt(everyoneOverwrites.deny);
        permissions |= BigInt(everyoneOverwrites.allow);    
    }

    let roleDeny = 0n, roleAllow = 0n;

    for (const roleId of member.roles) {
        const roleOverwrites = overwrites.get(roleId);
        if (!roleOverwrites) continue;
        roleDeny |= BigInt(roleOverwrites.deny);
        roleAllow |= BigInt(roleOverwrites.allow);
    }

    permissions &= ~roleDeny;
    permissions |= roleAllow;

    const memberOverwrite = overwrites.get(user_id);
    if (memberOverwrite) {
        permissions &= ~BigInt(memberOverwrite.deny);
        permissions &= BigInt(memberOverwrite.allow);
    }

    return permissions;
}

const GUILD_CHANNEL_TYPES = new Set<ChannelType>([
    ChannelType.GuildText,
    ChannelType.GuildVoice,
    ChannelType.GuildCategory,
    ChannelType.GuildAnnouncement,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.GuildStageVoice,
    ChannelType.GuildDirectory,
    ChannelType.GuildForum,
    ChannelType.GuildMedia,
])

export function isGuildChannel(channel: APIBasePartialChannel): channel is APIGuildChannel {
    return GUILD_CHANNEL_TYPES.has(channel.type)
}
