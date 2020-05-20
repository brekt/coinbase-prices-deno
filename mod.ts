// @ts-ignore
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
// @ts-ignore
import { Asset, Period, Price } from './types.ts';

const apiRoot = 'https://rest.coinapi.io/v1';

const myCoins: string[] = [
    'BTC',
    'ETH',
    'BAT',
    'LINK',
    'GNT',
    'CVC',
    'OMG'
];

/**
 * Add the following git ignored file (coinapi.io-key.env) that contains only your Coinapi.io API key.
 * Do not just paste your key in here because you'll risk committing it to GitHub,
 * where someone will find it and potentially steal your actual money.
 */
const apiKey = readFileStrSync('./coinapi.io-api-key.env');

const fetchOptions = {
    headers: {
        'Accept': 'application/json',
        'X-CoinAPI-Key': apiKey
    }
};


const getExchanges = async(): Promise<object | null> => {
    const url = `${apiRoot}/exchanges`;

    try {
        const response = await(await fetch(url, fetchOptions)).json();

        return response
    } catch (err) {
        console.error(err);

        return null;
    }
}

const getAssets = async (): Promise<Array<Asset>> => {
    const url = `${apiRoot}/assets`;

    try {
        const response = await(await fetch(url, fetchOptions)).json();

        return response
    } catch (err) {
        console.error(err);

        return [];
    }
}

const getMyAssets = async (): Promise<Array<Asset>> => {
    const assets = await getAssets();

    const myAssets = assets.filter(asset => myCoins.includes(asset.asset_id));

    return myAssets;
}

const getPrices = async (assets: Asset[]): Promise<Array<Price>> => {
    const prices = assets.map((asset) => ({
        coin: asset.asset_id,
        usd: asset.price_usd
    }));

    return prices;
};

const getPeriods = async (): Promise<Array<Period>> => {
    const periods = await(await fetch(`${apiRoot}/ohlcv/periods`, fetchOptions)).json();

    return periods;
};

const getPriceChange = async (coin: string, base = 'USD', period: string) : Promise<Price> => {
/**
{
    time_period_start: "2020-05-20T00:00:00.0000000Z",
    time_period_end: "2020-05-21T00:00:00.0000000Z",
    time_open: "2020-05-20T00:00:00.1362160Z",
    time_close: "2020-05-20T01:08:31.9131170Z",
    price_open: 9783.57,
    price_high: 9809.25,
    price_low: 9733,
    price_close: 9766.61,
    volume_traded: 1673.942753817,
    trades_count: 7996
}
 */
    try {
        const response = await(await fetch(`${apiRoot}/ohlcv/${coin}/${base}/latest?period_id=${period}&limit=1`, fetchOptions)).json();
        const data = response[0];

        console.log(data);
        const priceChange = data.price_close - data.price_open;
    
        return {
            coin,
            usd: priceChange
        };
    } catch (err) {
        console.error(err);

        throw err;
    }
}

const getMyPriceChanges = async () : Promise<Price[]> => {
    try {
        const promises = myCoins.map(coin => getPriceChange(coin, 'USD', '1DAY'));
        const changes = await Promise.all(promises);
    
        return changes;
    } catch (err) {
        console.error(err);

        throw err;
    }
}

(async () => {
    const priceChanges = await getMyPriceChanges();

    console.log(priceChanges);
})();

// (async () => {

//     const assets = await getMyAssets();

//     const prices = getPrices(assets);

//     console.log(prices);

// })();

// (async () => {
//     const periods = await getPeriods();

//     console.log(periods);
// })();
