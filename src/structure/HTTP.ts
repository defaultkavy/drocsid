import { loggerMap } from "../lib/logger";

const logger = loggerMap.api;

export interface FileResolver {
    blob: Blob;
    filename: string
}

export class HTTP {
    private token: string;
    constructor(token: string) {
        this.token = token;
    }
    
    async get<T>(url: string): Promise<T> {
        logger.debug(`GET`, url)
        return await fetch(`https://discord.com/api${url}`, {
            headers: {
            'Authorization': `Bot ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        }).then(async res => {
            const json = await res.json();
            if (!res.ok) throw logger.fatal(`GET`, url, JSON.stringify(json, undefined, 2));
            return json as T;
        });
    }

    async patch<T>(url: string, data: any, reason?: string): Promise<T> {
        return this.fetch('PATCH', url, data, undefined, reason)
    }

    async post<T>(url: string, data: any, reason?: string): Promise<T> {
        return this.fetch('POST', url, data, undefined, reason)
    }

    async put<T>(url: string, data: any = undefined, reason?: string): Promise<T> {
        return this.fetch('PUT', url, data, undefined, reason)
    }

    async delete<T>(url: string, data: any = undefined, reason?: string): Promise<T>  {
        return this.fetch('DELETE', url, data, undefined, reason)
    }

    async fetch<T>(method: string, url: string, data: any, files?: FileResolver[] | undefined, reason?: string): Promise<T> {
        logger.debug(`${method}`, url)
        const formdata = files ? new FormData() : undefined;

        const headers = new Headers();
        headers.set('Authorization', `Bot ${this.token}`);
        headers.set('Accept', `application/json`);
        if (reason) headers.set('X-Audit-Log-Reason', reason);

        let body: any;

        if (formdata && files) {
            if (data !== undefined) formdata.append('payload_json', JSON.stringify(data));
            files.forEach((file, i) => {
                formdata.append(`files[${i}]`, file.blob, file.filename)
            })
            body = formdata;
        }
        else {
            if (data !== undefined) {
                headers.set('Content-Type', 'application/json')
                body = JSON.stringify(data);
            }
        }

        return fetch(`https://discord.com/api${url}`, {
            method,
            headers,
            body
        }).then(async res => {
            const text = await res.text();
            const json = text ? JSON.parse(text) : undefined;
            if (!res.ok) throw logger.fatal(`${method}`, url, JSON.stringify({ body: data, payload: json }, undefined, 2));
            return json;
        });
    }
    
    query(params: Record<string, any> | undefined) {
        if (!params) return '';
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined && value === null) continue;
            if (value instanceof Array) search.set(key, value.join(','));
            else search.set(key, String(value));
        }
        return search.size ? `?${search}` : '';
    }
}