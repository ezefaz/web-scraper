import axios from 'axios';

export async function getMLUserToken(code: string) {
  const apiUrl = 'https://api.mercadolibre.com/oauth/token';
  const appId: any = process.env.MERCADOLIBRE_CLIENT_ID;
  const secretKey: any = process.env.MERCADOLIBRE_CLIENT_SECRET;
  const authorizationCode: any = process.env.MERCADOLIBRE_CODE;
  const redirectUri = 'https://savemelin.com/';
  const codeVerifier = 'YOUR_CODE_VERIFIER';

  const formData = new URLSearchParams();
  formData.append('grant_type', 'authorization_code');
  formData.append('client_id', appId);
  formData.append('client_secret', secretKey);
  formData.append('code', authorizationCode);
  formData.append('redirect_uri', redirectUri);
  formData.append('code_verifier', codeVerifier);

  try {
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: formData.toString(),
    // });

    // if (!response.ok) {
    //   throw new Error(`Failed to retrieve ML user token: ${response.statusText}`);
    // }

    // const data = await response.json();

    // console.log(data);

    let headersList = {
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
    };

    let bodyContent =
      'grant_type=authorization_code&client_id=7423381817150989&client_secret=ueOGFqfmUl1CGxl4dHHx5BIkU1AdbeC2&code=TG-65c2c5833ea4750001dade6c-159892588&redirect_uri=https://savemelin.com/profile/business&code_verifier=$CODE_VERIFIER';

    let reqOptions = {
      url: 'https://api.mercadolibre.com/oauth/token',
      method: 'POST',
      headers: headersList,
      data: bodyContent,
    };

    let response = await axios.request(reqOptions);
    const data = response.data;
    console.log(data);

    return data;
  } catch (error) {
    console.error('Error getting ML user token:', error);
    throw error;
  }
}
