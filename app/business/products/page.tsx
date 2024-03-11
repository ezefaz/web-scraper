import { useEffect, useState } from "react";
import { getSellerProducts } from "@/app/actions/mercadolibre/get-user-products";
import BusinessProductsTable from "@/components/business/BusinessProductsTable";
import { getSeller } from "@/lib/actions";
import { InitialProductDialog } from "@/components/business/modal/InitialProductDialog";
import { getMLCategories } from "@/app/actions/mercadolibre/category/get-ml-categories";
import NoData from "@/components/NoData";

type Props = {};

const BusinessProductsPage = async (props: Props) => {
	const userProducts = await getSellerProducts();

	return (
		<div className='pt-20'>
			<InitialProductDialog />
			{userProducts ? (
				<div>
					<NoData />
				</div>
			) : (
				<>
					<BusinessProductsTable userProducts={userProducts} />
				</>
			)}
		</div>
	);
};

export default BusinessProductsPage;
