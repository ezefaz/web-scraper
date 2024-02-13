import { getUserProducts } from "@/app/actions/mercadolibre/get-user-products";
import BusinessProductsTable from "@/components/business/BusinessProductsTable";
import { getSeller } from "@/lib/actions";

type Props = {};

const BusinessProductsPage = async (props: Props) => {
	const seller = await getSeller();
	console.log("VENDEDOR", seller);

	const sellerId = seller.id;
	const userProducts = await getUserProducts(sellerId);

	console.log("PRODUCTOS DEL USUARIO", userProducts);

	return (
		<div>
			<BusinessProductsTable userProducts={userProducts} />
		</div>
	);
};

export default BusinessProductsPage;
