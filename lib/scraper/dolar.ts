'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeDolarValue() {
  // bright data proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnathorized: false,
  };

  try {
    const response = await axios.get('https://www.valordolarblue.com.ar/', options);
    const $ = cheerio.load(response.data);

    const dolarValues = $($('.values strong'));
    const dolarBlueValue = dolarValues.map((index, element) => $(element).text().trim()).get(1);
    const currentDolarBlue = Number(dolarBlueValue);

    return currentDolarBlue;
  } catch (error: any) {
    throw new Error(`Failed to scrape usd dolar value; ${error.message}`);
  }
}
