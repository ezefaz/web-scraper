import { getSeller } from "@/lib/actions";
import axios from "axios";
import { Category } from "@/types";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function publishProduct(siteId: string, productData: any) {
  const { access_token } = await getSeller();

  const body = {
    title: productData.title,
    category_id: productData.category_id,
    price: productData.price,
    currency_id: productData.currency,
    available_quantity: productData.available_quantity,
    buying_mode: productData.buyingMode,
    condition: productData.condition,
    listing_type_id: productData.listing_type_id,
    pictures: productData.pictures,
    attributes: [
      {
        id: productData.firstAttribute_id,
        value_name: productData.firstAttribute_value_name,
      },
      {
        id: productData.secondAttribute_id,
        value_name: productData.secondAttribute_value_name,
      },
    ],
  };

  try {
    const response = await axios.post(`https://api.mercadolibre.com/items`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },

      body,
    });

    const publishedProduct = await response.data;

    if (!publishedProduct) {
      return {
        error: "No se pudo publicar el producto. Porfavor revisa los detalles.",
      };
    }

    return publishedProduct;
  } catch (error) {
    console.error("[ERROR_PUBLISHING_PRODUCT]", error);
    return { error: "Error al publicar el producto." };
  }
}
