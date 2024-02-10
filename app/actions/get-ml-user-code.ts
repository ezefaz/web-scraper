"use server";

import axios from "axios";

export async function getMLUserCode(code: string | null) {
	if (!code) {
		return { error: "No hay código!" };
	}

	const body = new URLSearchParams({
		grant_type: "authorization_code",
		client_id: String(process.env.MERCADOLIBRE_CLIENT_ID),
		// client_id: "7423381817150989",
		client_secret: String(process.env.MERCADOLIBRE_CLIENT_SECRET),
		// client_secret: "ueOGFqfmUl1CGxl4dHHx5BIkU1AdbeC2",
		redirect_uri:
			"https://4486-2800-40-3c-a31-bd35-e231-a9db-75f2.ngrok-free.app/profile/business",
		code,
	});

	try {
		// Getting the token from Mercadolibre.
		let responseToken = axios.post(
			"https://api.mercadolibre.com/oauth/token",
			body,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
			}
		);

		let accessToken = (await responseToken).data.access_token;

		if (!accessToken) {
			return { error: "No hay token de acceso." };
		}

		// Get the user data with the token

		const userResponse = await axios.get(
			"https://api.mercadolibre.com/users/me",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		// const userData = userResponse.data.json();

		console.log("RESPONSE DATA", userResponse.data);

		const {
			id,
			nickname,
			registration_date,
			first_name,
			last_name,
			gender,
			country_id,
			email,
		} = userResponse.data;

		const data = {
			id,
			nickname,
			registration_date,
			first_name,
			last_name,
			gender,
			country_id,
			email,
		};

		// Create seller on DB

		return data;
	} catch (error) {
		return {
			error: "No se pudo obtener los datos de la cuenta de Mercadolibre.",
		};
	}

	return code;
}
