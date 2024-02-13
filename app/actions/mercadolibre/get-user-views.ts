import axios from "axios";

interface UserViewsResponse {
	user_id: number;
	date_from: string;
	date_to: string;
	total_visits: number;
	visits_detail: any[];
}

export async function getUserViews(userId: string) {
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
			`https://api.mercadolibre.com/users/${userId}/items_visits?date_from=${dateFrom}&date_to=${dateTo}`,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					accept: "application/json",
				},
			}
		);

		let userVisits: UserViewsResponse = await response.data;

		if (!userVisits) {
			return { error: "No se pudieron obtener las visitas del usuario." };
		}

		const monthlyVisits = userVisits.total_visits;

		return monthlyVisits;
	} catch (error) {
		console.error("[ERROR_GETTING_USER_VIEWS]", error);
		return { error: "Error al obtener las visitas del usuario." };
	}
}
