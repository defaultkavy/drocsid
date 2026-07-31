import { PermissionFlagsBits, type APIGuildMember, type APIUser } from 'discord-api-types/payloads';
import { logger } from './lib/logger';

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

export function hasPermission(app_permissions: string, ...permissions: PermissionFlagsBitsName[]) {
    const bigint = BigInt(app_permissions);
    return permissions.every(permission => (bigint & PermissionFlagsBits[permission]) === PermissionFlagsBits[permission])
}

export function setLogLevel(level: 0 | 1 | 2 | 3) {
    logger.level = level;
}

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

export type AvatarSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;