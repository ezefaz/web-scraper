import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.MERCADOLIBRE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.MERCADOLIBRE_CLIENT_SECRET || "";
const BACKEND_URL =
	"https://690f-2800-40-3c-a31-292f-c798-14ba-91ee.ngrok-free.app/api/mercadolibre";

const REDIRECT_URL =
	"https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=7423381817150989&redirect_uri=https://690f-2800-40-3c-a31-292f-c798-14ba-91ee.ngrok-free.app/profile/business";

export default async function GET(req, res) {
	const { code } = req.query;

	const body = new URLSearchParams({
		grant_type: "authorization_code",
		client_id: "7423381817150989",
		client_secret: "ueOGFqfmUl1CGxl4dHHx5BIkU1AdbeC2",
		redirect_uri:
			"https://690f-2800-40-3c-a31-292f-c798-14ba-91ee.ngrok-free.app/profile/business",
		code: code,
	});

	try {
		console.log("ENTRA ACA");

		let response = await axios.post(
			"https://api.mercadolibre.com/oauth/token",
			body,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
			}
		);

		let accessToken = response.data.access_token;

		const userResponse = await axios.get(
			"https://api.mercadolibre.com/users/me",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const userData = userResponse.data;

		console.log(userData);

		return NextResponse.json({
			message: "Ok",
			data: userData,
		});
	} catch (error: any) {
		throw new Error(`Failed to get mercadolibre user data: ${error.message}`);
	}
}
