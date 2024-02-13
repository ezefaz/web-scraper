import BusinessDashboard from "@/components/business/Dashboard";
import Navbar from "@/components/business/NavBar";
import { getCurrentUser, getSeller } from "@/lib/actions";
import React from "react";

type Props = {};

const BusinessPage = async (props: Props) => {
  const foundSeller = await getSeller();

  console.log(foundSeller);

  return <BusinessDashboard />;
};

export default BusinessPage;
