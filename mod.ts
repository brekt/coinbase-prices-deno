// @ts-ignore
import { readFileStrSync } from 'https://deno.land/std@0.53.0/fs/mod.ts';
// @ts-ignore
import { Asset, Period, Price } from './types.ts';

const apiRoot = 'https://rest.coinapi.io/v1';

const myCoins: string[] = [
    'BTC',
    // 'ETH',
    // 'BAT',
    // 'LINK',
    // 'GNT',
    // 'CVC',
    // 'OMG'
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


function getTodayISO() {
	const today = new Date();
	today.setMinutes(today.getMinutes() - 2);

    return today.toISOString();
}

function getYesterdayISO() {
	const today = new Date();
	const yesterday = new Date(today);

	yesterday.setDate(yesterday.getDate() - 1);

	return yesterday.toISOString();
}


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

const get24HourChange = async (coin: string) : Promise<Price> => {
    try {
        const yResponse = await(await fetch(`${apiRoot}/ohlcv/${coin}/USD/history?period_id=1MIN&time_start=${getYesterdayISO()}&limit=1`, fetchOptions)).json();
        const yData = yResponse[0];
        const tResponse = await(await fetch(`${apiRoot}/ohlcv/${coin}/USD/history?period_id=1MIN&time_start=${getTodayISO()}&limit=1`, fetchOptions)).json();
        const tData = tResponse[0];
	   
        console.log('yesterday data:', yResponse, 'today data:', tResponse);

	    const priceChange = tData.price_close - yData.price_close;
        
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
        const promises = myCoins.map(coin => get24HourChange(coin));
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

(async () => {

     const assets = await getMyAssets();

     const prices = await getPrices(assets);

     console.log(prices);

 })();

