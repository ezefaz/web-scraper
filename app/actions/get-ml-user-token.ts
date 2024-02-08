export async function getMLUserToken() {
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
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve ML user token: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting ML user token:', error);
    throw error;
  }
}
