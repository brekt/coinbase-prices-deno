interface IPriceData {
    base: string;
    currency: string;
    amount: string;
}

export interface IPrice {
    data: IPriceData;
}