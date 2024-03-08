import { useEffect, useState } from "react";
import { getSellerProducts } from "@/app/actions/mercadolibre/get-user-products";
import BusinessProductsTable from "@/components/business/BusinessProductsTable";
import { getSeller } from "@/lib/actions";
import { InitialProductDialog } from "@/components/business/modal/InitialProductDialog";

type Props = {};

const BusinessProductsPage = async (props: Props) => {
  const userProducts = await getSellerProducts();

  console.log(userProducts);

  return (
    <div className="pt-20">
      <InitialProductDialog />
      {/* <BusinessProductsTable userProducts={userProducts} /> */}
    </div>
  );
};

export default BusinessProductsPage;
