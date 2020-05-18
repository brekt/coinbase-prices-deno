// @ts-ignore
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
// @ts-ignore
import { hmac, HMAC } from "https://denopkg.com/chiefbiiko/hmac/mod.ts";
// @ts-ignore
import { Hash, Price } from './types.ts';

const coinPairs: string[] = [
    'BTC-USD',
    'ETH-USD',
    'LINK-USD',
    'BAT-USD',
    // 'GNT-USD', not supported?
    // 'CVC-USD', not supported?
    // OMG-USDC coming May 18th, 2020 
];

const apiRoot = 'https://api.coinbase.com/v2';
const apiRootPro = 'https://api.pro.coinbase.com';

/**
 * Add the following git ignored file (api-key.env) that contains only your Coinbase API key.
 * Do not just paste your key in here because you'll risk committing it to GitHub,
 * where someone will find it and potentially steal your actual money.
 */
const apiKey = readFileStrSync('./api-key.env');

/**
 * Get market price of a cryptocurrency.
 */
const getCoinPrice = async (currencyPair: string): Promise<Price | void> => {
    try {
        const price = await (await fetch(`${apiRoot}/prices/${currencyPair}/spot`)).json();

        if (price.errors) {
            throw new Error(`Error in getCoinPrice for ${currencyPair}: ${JSON.stringify(price.errors)}`);
        }
    
        return price;
    } catch (err) {
        console.error(err);

        return void 0;
    }
};

const getAllCurrencies = async (): Promise<any> => {
    try {
        const pairs = await (await fetch(`${apiRootPro}/currencies/`)).json();

        return pairs;
    } catch (err) {
        console.error(err);

        return void 0;
    }
};

const hitOracle = async(): Promise<any> => {
    const url = `${apiRootPro}/oracle`;
    const signedMessage = signMessage(url);
    const fetchOptions = {
        headers: {
            'CB-ACCESS-KEY': apiKey,
            'CB-ACCESS-SIGN': signedMessage
        }
    };

    try {
        const oracleResponse = await(await fetch(`${apiRootPro}/oracle`, fetchOptions)).json();

        return oracleResponse;
    } catch (err) {
        console.error(err);

        return void 0;
    }
}

(async () => {

    const pricePromises = coinPairs.map(pair => getCoinPrice(pair));

    for await (const price of pricePromises) {
        price && console.log(price);
    }

})();

// const signMessage = (url: string, method = 'GET', body = ''): string => {
//     const timestamp = Date.now() / 1000;
//     const requestPath = '/oracle';
//     const stringifiedBody = JSON.stringify(body);
//     const prehash = timestamp + method + requestPath + stringifiedBody;
//     const key = btoa(apiKey);

//     const sha256Hmac = hmac('sha256', key, pre);

//     return sha256Hmac.update(prehash).digest('base64');
// }


// (async () => {

//     const oracleResponse = await hitOracle();

//     console.log(oracleResponse);

// })();
