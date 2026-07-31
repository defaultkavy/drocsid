import { Logger } from "@defaultkavy/logger";

export const logger = new Logger({ prefix: ['Discord'] })

export const loggerMap = {
    builder: logger.prefix('Builder'),
    api: logger.prefix('API'),
    gateway: logger.prefix('Gateway'),
    client: logger.prefix('Client')
}