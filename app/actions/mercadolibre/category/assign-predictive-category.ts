import { getSeller } from "@/lib/actions";
import axios from "axios";
import { getMLCategories } from "./get-ml-categories";
import { Category } from "@/types";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function assignPredictiveCategory(
  siteId: string,
  product: string
) {
  const { access_token } = await getSeller();
  try {
    const response = await axios(
      `https://api.mercadolibre.com/sites/${siteId}/search?q=${product}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    let predictiveCategoryId = await response.data.results[0].id;

    if (!predictiveCategoryId) {
      return { error: "No se pudo predecir la categoría." };
    }

    const categories = await getMLCategories(siteId);

    const matchedCategory = await categories.find(
      (category: Category) => predictiveCategoryId == category.id
    );

    const categoryName = matchedCategory.name;

    return categoryName;
  } catch (error) {
    console.error("[ERROR_PREDICTING_CATEGORIES]", error);
    return { error: "Error al predecir la categoria." };
  }
}
