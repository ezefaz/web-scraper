import BusinessDashboard from "@/components/business/Dashboard";
import Navbar from "@/components/business/NavBar";
import { getCurrentUser, getSeller } from "@/lib/actions";
import React from "react";
import { getSellerProducts } from "../actions/mercadolibre/get-user-products";

type Props = {};

const BusinessPage = async (props: Props) => {
	const foundSeller = await getSeller();

	const userProducts = await getSellerProducts();

	const totalProducts = userProducts.length;

	const soldProducts = userProducts.filter(
		(product: any) => product.sold_quantity > 0
	);

	if (!foundSeller) {
		return alert("No se encontró vendedor");
	}

	const transactions = foundSeller.seller_reputation.total;

	return (
		<BusinessDashboard
			sales={transactions}
			soldProducts={soldProducts.length}
			userProducts={totalProducts}
		/>
	);
};

export default BusinessPage;
