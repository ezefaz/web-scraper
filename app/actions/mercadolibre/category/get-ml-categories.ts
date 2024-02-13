import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getMLCategories(siteId: string) {
  try {
    const response = await axios(
      `https://api.mercadolibre.com/sites/${siteId}/categories`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );

    let categories = await response.data;

    if (!categories) {
      return { error: "No se pudieron obtener las sitios disponibles." };
    }

    return categories;
  } catch (error) {
    console.error("[ERROR_GETTING_CATEGORIES]", error);
    return { error: "Error al obtener las categorias disponisbles del sitio." };
  }
}
