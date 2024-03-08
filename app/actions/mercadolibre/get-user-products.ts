import { getSeller } from "@/lib/actions";
import { SellerProfile } from "@/types";
import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getSellerProducts() {
  const seller: SellerProfile = await getSeller();
  const { access_token, id } = seller;

  try {
    const response = await axios(
      `https://api.mercadolibre.com/users/${id}/items/search`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
          authorization: `Bearer ${access_token}`,
        },
      }
    );

    let productsIds = await response.data;

    if (!productsIds) {
      return { error: "No se pudieron obtener los productos del usuario." };
    }

    const itemsQueryString = productsIds.results.slice(0, 20).join(",");

    const itemsResponse = await axios.get(
      `https://api.mercadolibre.com/items?ids=${itemsQueryString}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
          authorization: `Bearer ${seller.access_token}`,
        },
      }
    );

    const userProducts = itemsResponse.data;

    if (!userProducts) {
      return {
        error:
          "No se pudieron obtener los detalles de los productos del usuario.",
      };
    }

    const simplifiedProducts = userProducts.map((product: any) => ({
      id: product.body.id,
      title: product.body.title,
      category_id: product.body.category_id,
      price: product.body.price,
      base_price: product.body.base_price,
      original_price: product.body.original_price,
      currency_id: product.body.currency_id,
      initial_quantity: product.body.initial_quantity,
      available_quantity: product.body.available_quantity,
      sold_quantity: product.body.sold_quantity,
      listing_type_id: product.body.listing_type_id,
      condition: product.body.condition,
      permalink: product.body.permalink,
      status: product.body.status,
      warranty: product.body.warranty,
      date_created: product.body.date_created,
    }));

    return simplifiedProducts;
  } catch (error) {
    console.error("[ERROR_GETTING_USER_PRODUCTS]", error);
    return { error: "Error al obtener los productos del usuario." };
  }
}
