import { useEffect, useState } from "react";
import { getUserProducts } from "@/app/actions/mercadolibre/get-user-products";
import BusinessProductsTable from "@/components/business/BusinessProductsTable";
import { getSeller } from "@/lib/actions";

type Props = {};

const BusinessProductsPage = async (props: Props) => {
  const userProducts = await getUserProducts();

  console.log(userProducts);

  return (
    <div>
      <BusinessProductsTable userProducts={userProducts} />
    </div>
  );
};

export default BusinessProductsPage;
