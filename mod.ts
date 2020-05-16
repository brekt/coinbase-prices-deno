// @ts-ignore
import { readFileStrSync } from 'https://deno.land/std/fs/mod.ts';
// @ts-ignore
import { IPrice } from './types.ts';

const apiRootPro = 'https://api-public.sandbox.pro.coinbase.com';

const apiRoot = 'https://api.coinbase.com/v2';

const apiKey = readFileStrSync('./api-key.env'); // Make this file yourself and add your Coinbase API key to it.

const getCoinPrice = async (currencyPair: string): Promise<IPrice> => {
    const price = await (await fetch(`${apiRoot}/prices/${currencyPair}/buy`)).json();
    
    return price;
};
  

(async() => {
    const btcPrice = await getCoinPrice('BTC-USD');

    console.log(btcPrice.data);
})();
