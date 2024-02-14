"use server";

import { getSeller } from "@/lib/actions";
import sellerModel from "@/lib/models/seller.model";
import { connectToDb } from "@/lib/mongoose";
import axios from "axios";

export async function refreshToken() {
  const seller = await getSeller();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: String(process.env.MERCADOLIBRE_CLIENT_ID),
    client_secret: String(process.env.MERCADOLIBRE_CLIENT_SECRET),
    refresh_token: seller.refresh_token,
  });

  try {
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

    await connectToDb();

    // 2. Update the access token from the seller

    await sellerModel.updateOne(
      { email: seller.email },
      { $set: { access_token: accessToken } }
    );

    await seller.save();

    return {
      success: "El token fue actualizado correctamente!",
    };
  } catch (error) {
    return {
      error: "No se pudo actualizar el token de acceso.",
    };
  }
}
