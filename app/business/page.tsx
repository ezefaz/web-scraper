import BusinessDashboard from "@/components/business/Dashboard";
import Navbar from "@/components/business/NavBar";
import React from "react";

type Props = {};

const BusinessPage = (props: Props) => {
  return (
    <div className="mt-20">
      <Navbar />
      <BusinessDashboard />
    </div>
  );
};

export default BusinessPage;
