import { loggerMap } from "./logger";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {}

export type PathResolver<P extends string, V> = P extends `${infer A}/${infer Rest}`
    ?   ParamResolver<A, Rest, V>
    :   ParamResolver<P, null, V>

export type ParamResolver<A extends string, Rest extends string | null, V> = 
    A extends `{${infer Param}}`
    ?   Rest extends string
        ?   OptionalResolver<Param, V> & PathResolver<Rest, V>
        :   OptionalResolver<Param, V>
    :   Rest extends string 
        ?   PathResolver<Rest, V>
        :   never;

export type OptionalResolver<K extends string, V> = K extends `${infer Param}?` ? Record<Param, V | undefined> : Record<K, V>

export function customIdMaxLengthCheck(custom_id: string) {
    if (custom_id.length >= 100) throw loggerMap.builder.prefix(['Discord Builder']).fatal(`custom_id length exceeded (${custom_id.length})`)
}