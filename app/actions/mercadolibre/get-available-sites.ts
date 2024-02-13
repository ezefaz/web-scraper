import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getMLAvailableSites() {
  try {
    const response = await axios(`https://api.mercadolibre.com/sites`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
    });

    let availableSites = await response.data;

    if (!availableSites) {
      return { error: "No se pudieron obtener las sitios disponibles." };
    }

    return availableSites;
  } catch (error) {
    console.error("[ERROR_GETTING_SITES]", error);
    return { error: "Error al obtener los sitios disponisbles del usuario." };
  }
}
