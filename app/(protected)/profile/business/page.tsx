'use client';

import { getMLUserToken } from '@/app/actions/get-ml-user-token';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type Props = {};

const BusinessProfilePage = (props: Props) => {
  const router = useRouter();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // const code = urlParams.get('code');
    const code = process.env.MERCADOLIBRE_CODE;

    if (code) {
      getMLUserToken(code)
        .then((tokenData) => {
          console.log('MercadoLibre user token data:', tokenData);
        })
        .catch((error) => {
          console.error('Error getting MercadoLibre user token:', error);
        });

      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router]);

  return <div>BusinessProfilePage</div>;
};

export default BusinessProfilePage;
