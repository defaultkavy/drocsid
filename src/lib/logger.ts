import { Logger } from "@defaultkavy/logger";

export const loggerMap = {
    builder: new Logger({ prefix: ['Discord Builder'] }),
    api: new Logger({ prefix: ['Discord API'] }),
    gateway: new Logger({ prefix: ['Discord Gateway'] }),
    client: new Logger({ prefix: ['Discord Client'] })
}