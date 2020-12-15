export interface HasValue {
    value(): Promise<string>;
}