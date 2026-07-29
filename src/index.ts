import { PermissionFlagsBits } from 'discord-api-types/payloads';
import { loggerMap } from './lib/logger';

export * from 'discord-api-types/payloads';
export * from 'discord-api-types/gateway';
export * as Event from './event';
export * as Builder from './builder';
export * as API from './structure/api';
export { Client } from './structure/Client';
export { Gateway } from './structure/Gateway';
export { Guild } from './structure/Guild';

export type PermissionFlagsBitsName = keyof typeof PermissionFlagsBits;

export function hasPermission(app_permissions: string, ...permissions: PermissionFlagsBitsName[]) {
    const bigint = BigInt(app_permissions);
    return permissions.every(permission => (bigint & PermissionFlagsBits[permission]) === PermissionFlagsBits[permission])
}

export function setLogLevel(level: 0 | 1 | 2 | 3) {
    Object.entries(loggerMap).forEach(([_, logger]) => logger.config.level = level)
}