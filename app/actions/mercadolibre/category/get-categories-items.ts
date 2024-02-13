import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getMLCategoriesItems(siteId: string, categoryId: string) {
  try {
    const response = await axios(
      `https://api.mercadolibre.com/sites/${siteId}/search?category=${categoryId}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );

    let categories = await response.data;

    if (!categories) {
      return { error: "No se pudieron obtener los items." };
    }

    return categories;
  } catch (error) {
    console.error("[ERROR_GETTING_CATEGORIES]", error);
    return { error: "Error al obtener los items de la categoria del sitio." };
  }
}
