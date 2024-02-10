"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMLUserCode } from "@/app/actions/get-ml-user-code";
import { SellerProfile } from "@/types";

type Props = {};

const BusinessProfilePage = (props: Props) => {
  const [userData, setUserData] = useState<SellerProfile | null>(null);
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: SellerProfile = await getMLUserCode(code);

        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("DATUUUN", userData);

  return (
    <div>
      <h1>Cuenta creada con éxito.</h1>
      {userData ? (
        <div>
          {/* Display user profile information here */}
          <p>Primer Nombre: {userData.first_name}</p>
          <p>Nickname: {userData.nickname}</p>
          <p>Registration Date: {userData.registration_date}</p>
          {/* ... other fields */}
        </div>
      ) : (
        <p>Creando cuenta de negocio, porfavor aguarde un momento...</p>
      )}
    </div>
  );
};

export default BusinessProfilePage;
