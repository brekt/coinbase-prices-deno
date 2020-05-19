// @ts-ignore
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
// @ts-ignore
import { Asset, Price } from './types.ts';

const apiRoot = 'https://rest.coinapi.io/v1';


/**
 * Add the following git ignored file (coinapi.io-key.env) that contains only your Coinapi.io API key.
 * Do not just paste your key in here because you'll risk committing it to GitHub,
 * where someone will find it and potentially steal your actual money.
 */
const apiKey = readFileStrSync('./coinapi.io-api-key.env');

const headers = {
    'Accept': 'application/json',
    'X-CoinAPI-Key': apiKey
};

const getExchanges = async(): Promise<object | null> => {
    const url = `${apiRoot}/exchanges`;
    const fetchOptions = {
        headers
    };

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
    const fetchOptions = {
        headers
    };

    try {
        const response = await(await fetch(url, fetchOptions)).json();

        return response
    } catch (err) {
        console.error(err);

        return [];
    }
}

const getMyAssets = async (): Promise<Array<Asset>> => {
    const myCoins: string[] = [
        'BTC',
        'ETH',
        'BAT',
        'LINK',
        'GNT',
        'CVC',
        'OMG'
    ];

    const assets = await getAssets();

    const myAssets = assets.filter(asset => myCoins.includes(asset.asset_id));

    return myAssets;
}

const getPrices = async (assets: Asset[]): Promise<Array<Price>> => {
    
    const prices = assets.map((asset) => ({
        symbol: asset.asset_id,
        usd: asset.price_usd
    }));

    return prices;
};

(async () => {

    const assets = await getMyAssets();

    const prices = getPrices(assets);

    console.log(prices);

})();
