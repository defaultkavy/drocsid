import { GatewayDispatchEvents, type GatewayDispatchPayload, GatewayIntentBits, type GatewayReceivePayload, type GatewaySendPayload } from "discord-api-types/gateway";
import { Discord } from "../..";
import { loggerMap } from "../lib/logger";
import { BaseGatewayEvent } from "../event/BaseGatewayEvent";

const logger = loggerMap.gateway;

export class Gateway {
    ws: WebSocket | null = null;
    seq: number | null = null;
    session_id: string | null = null;
    intents;
    private token: string;
    private resume_gateway_url: string | null = null;
    private heartbeat_timer: NodeJS.Timeout | null = null;
    eventMap = new Map<GatewayDispatchEvents, Set<(event: BaseGatewayEvent) => void>>();
    client: Discord.Client;
    constructor(client: Discord.Client, token: string, intents: (keyof typeof GatewayIntentBits)[]) {
        this.token = token;
        this.intents = intents;
        this.client = client;
    }

    connect() {
        logger.debug('Connecting...')
        this.ws = new WebSocket(`wss://gateway.discord.gg/?v=10&encoding=json`);
        this.listen();
    }

    startHeartbeat(interval: number) {
        this.heartbeat_timer = setInterval(() => this.heartbeat(), interval);
    }

    identify() {
        logger.debug('Identify')
        this.send({
            op: 2,
            d: {
                token: this.token,
                intents: this.intents.reduce((p, v) => p |+ GatewayIntentBits[v], 0),
                properties: {
                    os: 'linux',
                    browser: 'kiria',
                    device: 'kiria'
                }
            }
        })
    }

    heartbeat() {
        logger.debug(`Heartbeat`)
        this.send({
            op: 1,
            d: this.seq
        })
    }

    resume() {
        logger.debug('Resume')
        this.send({
            op: 6,
            d: {
                token: this.token,
                session_id: this.session_id,
                seq: this.seq
            }
        })
    }

    reconnect() {
        if (!this.resume_gateway_url) throw logger.fatal('reconnect failed (resume_gateway_url is null)');
        logger.debug('Reconnecting...')
        this.ws = new WebSocket(this.resume_gateway_url);
        this.listen();
    }

    disconnect() {
        this.ws?.close(1000)
        this.heartbeat_timer?.close();
        this.ws = null;
    }

    send(payload: any) {
        this.ws?.send(JSON.stringify(payload))
    }

    on<K extends keyof typeof GatewayDispatchEvents>(type: K, listener: GatewayEventListener<K>) {
        let listenerList = this.eventMap.get(GatewayDispatchEvents[type]) ?? new Set();
        listenerList.add(listener as any);
        this.eventMap.set(GatewayDispatchEvents[type], listenerList);
        return () => this.off(type, listener as any);
    }

    off<K extends keyof typeof GatewayDispatchEvents>(type: K, listener: GatewayEventListener<K>) {
        this.eventMap.get(GatewayDispatchEvents[type])?.delete(listener as any);
    }

    private listen() {
        this.ws?.addEventListener('open', e => {
            logger.debug('Connected')
        })
        this.ws?.addEventListener('message', e => {
            const res = JSON.parse(e.data) as Gateway.Messages;
            switch (res.op) {
                // Handshake Success
                case 10: {
                    logger.debug('Hello');
                    this.seq = res.s;
                    this.startHeartbeat(res.d.heartbeat_interval);
                    this.identify();
                    break;
                }
                case 11: {
                    logger.debug('Heartbeat ACK');
                    break;
                }
                case 0: {
                    this.seq = res.s;
                    this.eventHandle(res);
                }
            }

        })
        this.ws?.addEventListener('error', e => {
            logger.error('WebSocket Error');
        })
        this.ws?.addEventListener('close', e => {
            logger.error('WebSocket Close:', e.reason, e);
            this.disconnect();
            this.reconnect();
        })
    }

    private eventHandle(e: Gateway.Payload.Dispatch) {
        switch(e.t) {
            case Gateway.Events.Ready: {
                this.session_id = e.d.session_id;
                this.resume_gateway_url = e.d.resume_gateway_url;
                break;
            }
        }
        logger.debug(`Event Dispatch: ${e.t}`);
        this.eventMap.get(e.t)?.forEach(fn => fn(new BaseGatewayEvent(this.client, e)))
    }
}

export type GatewayEventListener<K extends keyof typeof GatewayDispatchEvents = any> = (event: BaseGatewayEvent<GatewayDispatchPayload & { t: typeof GatewayDispatchEvents[K] }>) => void

export namespace Gateway {
    export import Events = GatewayDispatchEvents;
    export type Messages = GatewayDispatchPayload | GatewayReceivePayload;
    export namespace Payload {
        export type Dispatch = GatewayDispatchPayload;
        export type Receive = GatewayReceivePayload;
        export type Send = GatewaySendPayload;
    }

    export import Intents = GatewayIntentBits;
}