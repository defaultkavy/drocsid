import type { GatewayDispatchPayload } from "..";
import type { Discord } from "../..";

export class BaseGatewayEvent<D extends GatewayDispatchPayload = GatewayDispatchPayload> {
    client: Discord.Client;
    data: D['d'];
    type: D['t'];
    constructor(client: Discord.Client, payload: D) {
        this.client = client;
        this.data = payload.d;
        this.type = payload.t
    }
}