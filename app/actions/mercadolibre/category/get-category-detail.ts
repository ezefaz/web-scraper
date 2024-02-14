import { getSeller } from "@/lib/actions";
import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getCategoryDetail(categoryId: string) {
  const { access_token } = await getSeller();

  try {
    const response = await axios(
      `https://api.mercadolibre.com/categories/${categoryId}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    let category = await response.data;

    if (!category) {
      return { error: "No se pudieron obtener las categorias." };
    }

    return category;
  } catch (error) {
    console.error("[ERROR_GETTING_CATEGORY]", error);
    return { error: "Error al obtener la categoría." };
  }
}
