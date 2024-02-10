import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.MERCADOLIBRE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.MERCADOLIBRE_CLIENT_SECRET || '';
const BACKEND_URL = 'https://4486-2800-40-3c-a31-bd35-e231-a9db-75f2.ngrok-free.app/profile/business';

const REDIRECT_URL =
  'https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=7423381817150989&redirect_uri=https://4486-2800-40-3c-a31-bd35-e231-a9db-75f2.ngrok-free.app/profile/business';

export async function GET(req, res) {
  console.log('REQQQQQ', req.body);

  const { code } = req.body;

  if (!code) {
    console.error('Code not found in the URL');
    return res.status(400).json({ error: 'Code not found in the URL' });
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: '7423381817150989',
    client_secret: 'ueOGFqfmUl1CGxl4dHHx5BIkU1AdbeC2',
    redirect_uri: 'https://4486-2800-40-3c-a31-bd35-e231-a9db-75f2.ngrok-free.app/profile/business',
    code: code,
  });

  try {
    let response = await axios.post('https://api.mercadolibre.com/oauth/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    let accessToken = response.data.access_token;

    const userResponse = await axios.get('https://api.mercadolibre.com/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;

    console.log(userData);

    return NextResponse.json({
      message: 'Ok',
      data: userData,
    });
  } catch (error: any) {
    throw new Error(`Failed to get mercadolibre user data: ${error.message}`);
  }
}
