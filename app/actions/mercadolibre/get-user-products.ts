import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getUserProducts(userId: string) {
	if (!userId) {
		return;
	}

	console.log("USUARIARA", userId);

	try {
		const response = await axios(
			`https://api.mercadolibre.com/users/${userId}/items/search`,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					accept: "application/json",

					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		let userProducts = await response.data;

		if (!userProducts) {
			return { error: "No se pudieron obtener los productos del usuario." };
		}

		return userProducts;
	} catch (error) {
		console.error("[ERROR_GETTING_USER_PRODUCTS]", error);
		return { error: "Error al obtener los productos del usuario." };
	}
}
