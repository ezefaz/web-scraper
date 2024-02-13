import BusinessDashboard from "@/components/business/Dashboard";
import Navbar from "@/components/business/NavBar";
import { getCurrentUser, getSeller } from "@/lib/actions";
import React from "react";

type Props = {};

const BusinessPage = async (props: Props) => {
	const foundSeller = await getSeller();

	if (!foundSeller) {
		return alert("No se encontró vendedor");
	}

	const transactions = foundSeller.seller_reputation.total;

	console.log(foundSeller);

	return <BusinessDashboard sales={transactions} />;
};

export default BusinessPage;
