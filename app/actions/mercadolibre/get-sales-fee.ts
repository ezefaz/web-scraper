import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getSalesFee() {
  try {
    const response = await axios(
      `https://api.mercadolibre.com/sites/MLA/listing_prices?price=1`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );

    let salesFee = await response.data;

    if (!salesFee) {
      return { error: "No se pudieron obtener las sitios disponibles." };
    }

    return salesFee;
  } catch (error) {
    console.error("[ERROR_GETTING_SITES]", error);
    return { error: "Error al obtener los sitios disponisbles del usuario." };
  }
}
