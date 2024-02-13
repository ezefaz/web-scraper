import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getProductPage(userId: string) {
  if (!userId) {
    return;
  }

  // Get the current date
  const currentDate = new Date();

  // Set the first day of the current month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Set the last day of the current month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Format dates to ISO strings
  const dateFrom = firstDayOfMonth.toISOString();
  const dateTo = lastDayOfMonth.toISOString();

  try {
    const response = await axios(
      `https://api.mercadolibre.com/users/${userId}/items/search`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );

    let userProducts = await response.data;

    if (!userProducts) {
      return { error: "No se pudieron obtener las visitas del usuario." };
    }

    return userProducts;
  } catch (error) {
    console.error("[ERROR_GETTING_USER_PRODUCTS]", error);
    return { error: "Error al obtener los productos del usuario." };
  }
}
