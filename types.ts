export interface Price {
    coin: string;
    usd: number;
}

export interface Asset {
    asset_id: string;
    name: string;
    type_is_crypto: number;
    data_start: string;
    data_end: string;
    data_quote_start: string;
    data_quote_end: string;
    data_orderbook_start: string;
    data_orderbook_end: string;
    data_trade_start: string;
    data_trade_end: string;
    data_symbols_count: number;
    price_usd: number;
    volume_1hrs_usd: number;
    volume_1day_usd: number;
    volume_1mth_usd: number;
    id_icon: string;
}

export interface Period {
    period_id: string;
    length_seconds: number;
    length_months: number;
    unit_count: number;
    unit_name: string;
    display_name: string;
}