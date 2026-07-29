import { loggerMap } from "./logger";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {}

export type PathResolver<P extends string, V extends any> = P extends `${infer A}/${infer Rest}`
    ?   ParamResolver<A, Rest, V>
    :   ParamResolver<P, null, V>

export type ParamResolver<A extends string, Rest extends string | null, V extends any> = 
    A extends `{${infer Param}}`
    ?   Rest extends string
        ?   Record<Param, V> & PathResolver<Rest, V>
        :   Record<Param, V>
    :   Rest extends string 
        ?   PathResolver<Rest, V>
        :   {};

export function customIdMaxLengthCheck(custom_id: string) {
    if (custom_id.length >= 100) throw loggerMap.builder.prefix(['Discord Builder']).fatal(`custom_id length exceeded (${custom_id.length})`)
}