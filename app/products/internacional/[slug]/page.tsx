import InternationalProduct from '@/components/InternationalProduct';
import internationalProductStore from '@/store/internationalProductStore';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface InternationalProductPageProps {}

const InternationalProductsPage = () => {
  return (
    <div>
      <InternationalProduct />
    </div>
  );
};

export default InternationalProductsPage;
