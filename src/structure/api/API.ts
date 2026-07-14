
export class API {
    private token: string;
    constructor(token: string) {
        this.token = token;
    }
    
    get headers() {
        return {
            'Authorization': `Bot ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    async get<T>(url: string): Promise<T> {
        return await fetch(`https://discord.com/api${url}`, {
            headers: this.headers
        }).then(async res => {
            const json = await res.json();
            if (res.status !== 200) throw json;
            return json as T;
        });
    }

    async patch<T>(url: string, data: any, reason?: string): Promise<T> {
        return this.fetch('PATCH', url, data, reason)
    }

    async post<T>(url: string, data: any, reason?: string): Promise<T> {
        return this.fetch('POST', url, data, reason)
    }

    async put<T>(url: string, data: any = undefined, reason?: string): Promise<T> {
        return this.fetch('PUT', url, data, reason)
    }

    async delete<T>(url: string, data: any = undefined, reason?: string): Promise<T>  {
        return this.fetch('DELETE', url, data, reason)
    }

    async fetch<T>(method: string, url: string, data: any, reason?: string): Promise<T> {
        return fetch(`https://discord.com/api${url}`, {
            method,
            headers: {
                ...this.headers,
                ...(reason ? {'X-Audit-Log-Reason': reason} : {})
            },
            body: data !== undefined ? JSON.stringify(data) : undefined
        }).then(async res => {
            const text = await res.text();
            const json = text ? JSON.parse(text) : undefined;
            if (json && 'code' in json) {
                throw new Error(json);
            }
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