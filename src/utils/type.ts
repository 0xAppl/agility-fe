export type ExtractFunctionParams<T> = T extends (...args: infer P) => infer R ? P : never;

export type ExtractArrayType<T> = T extends Array<infer R> ? R : never;
