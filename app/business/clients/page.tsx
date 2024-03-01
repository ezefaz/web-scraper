import BusinessClientsTable from "@/components/business/BusinessClientsTable";
import ClientList from "@/components/business/ClientList";
import React from "react";

type Props = {};

const ClientsPage = (props: Props) => {
  return (
    <div className="grid grid-cols-2 p-4">
      <div className="flex items-center">
        <ClientList />
      </div>
      <div className="">
        <BusinessClientsTable />
      </div>
    </div>
  );
};

export default ClientsPage;
