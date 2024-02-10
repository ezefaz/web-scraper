"use server";

import sellerModel from "@/lib/models/seller.model";
import axios from "axios";

export async function getMLUserCode(code: string | null) {
  if (!code) {
    return { error: "No hay código!" };
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: String(process.env.MERCADOLIBRE_CLIENT_ID),
    // client_id: "7423381817150989",
    client_secret: String(process.env.MERCADOLIBRE_CLIENT_SECRET),
    // client_secret: "ueOGFqfmUl1CGxl4dHHx5BIkU1AdbeC2",
    redirect_uri:
      "https://4486-2800-40-3c-a31-bd35-e231-a9db-75f2.ngrok-free.app/profile/business",
    code,
  });

  try {
    // 1. Getting the token from Mercadolibre.
    let responseToken = axios.post(
      "https://api.mercadolibre.com/oauth/token",
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    let accessToken = (await responseToken).data.access_token;

    if (!accessToken) {
      return { error: "No hay token de acceso." };
    }

    // 2. Get the user data with the token

    const userResponse = await axios.get(
      "https://api.mercadolibre.com/users/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const sellerData = userResponse.data;

    // 3. Check if the seller already exists in the DB
    const existingSeller = await sellerModel.findOne({ id: sellerData.id }); // Assuming 'id' is the unique identifier

    if (existingSeller) {
      console.log("Seller already exists:", existingSeller);
      return { message: "Seller already exists." };
    }

    // 4. Create seller on DB
    const seller = new sellerModel(sellerData);
    const savedSeller = await seller.save();

    console.log("Seller saved:", savedSeller);

    return savedSeller;
  } catch (error) {
    return {
      error: "No se pudo obtener los datos de la cuenta de Mercadolibre.",
    };
  }

  return code;
}
