interface PriceData {
    base: string;
    currency: string;
    amount: string;
}

export interface Price {
    data: PriceData;
}

export interface Hash {
    hashSize: number;
    init(): Hash;
    update(msg: string | Uint8Array, inputEncoding?: string): Hash;
    digest(outputEncoding?: string): string | Uint8Array;
}