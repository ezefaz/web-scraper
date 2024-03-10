import { getSeller } from "@/lib/actions";
import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getMLCategories(siteId: string) {
	const { access_token } = await getSeller();

	try {
		const response = await axios(
			`https://api.mercadolibre.com/sites/${siteId}/categories`,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					accept: "application/json",
					Authorization: `Bearer ${access_token}`,
				},
			}
		);

		console.log("DATINES", response.data);

		let categories = await response.data;

		console.log("OBTENIENDO DATOS", categories);

		if (!categories) {
			return { error: "No se pudieron obtener las categorias." };
		}

		const formattedCategories = categories.map((category: any) => ({
			id: category.id,
			name: category.name,
		}));

		return formattedCategories;
	} catch (error) {
		console.error("[ERROR_GETTING_CATEGORIES]", error);
		return { error: "Error al obtener las categorias disponibles del sitio." };
	}
}
