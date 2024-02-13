"use server";

import sellerModel from "@/lib/models/seller.model";
import { connectToDb } from "@/lib/mongoose";
import { SellerProfile } from "@/types";
import axios from "axios";

const BACKEND_URL =
	"https://9bfc-2800-40-3c-a31-8942-f74e-cd92-a472.ngrok-free.app/profile/business";

const REDIRECT_URL =
	"https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=7423381817150989&redirect_uri=https://9bfc-2800-40-3c-a31-8942-f74e-cd92-a472.ngrok-free.app/profile/business";

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
			"https://9bfc-2800-40-3c-a31-8942-f74e-cd92-a472.ngrok-free.app/profile/business",
		code,
	});

	try {
		// 1. Getting the token from Mercadolibre.
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

		// 2. Get the user data with the token

		const userResponse = await axios.get(
			"https://api.mercadolibre.com/users/me",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const sellerData = userResponse.data;

		await connectToDb();

		// 3. Check if the seller already exists in the DB
		const existingSeller = await sellerModel.findOne({
			email: sellerData.email,
		});

		if (existingSeller) {
			console.log("Seller already exists");
			return {
				message: "Cuenta vendedor ya existe! Porfavor inicie sesión.",
			};
		}

		const seller = await sellerModel.create({
			id: sellerData.id,
			nickname: sellerData.nickname,
			registration_date: sellerData.registration_date,
			first_name: sellerData.first_name,
			last_name: sellerData.last_name,
			country_id: sellerData.country_id,
			email: sellerData.email,
			identification: sellerData.identification,
			address: sellerData.address,
			phone: sellerData.phone,
			user_type: sellerData.user_type,
			logo: sellerData.logo,
			tags: sellerData.tags,
			// points: sellerData.points,
			// site_id: sellerData.site_id,
			// permalink: sellerData.permalink,
			seller_experience: sellerData.seller_experience,
			seller_reputation: sellerData.seller_reputation,
			access_token: accessToken,
			// buyer_reputation: sellerData.buyer_reputation,
			// company: sellerData.company,
		});

		await seller.save();

		return {
			success: "La cuenta de vendedor fue creada correctamente!",
		};
	} catch (error) {
		return {
			error: "No se pudo obtener los datos de la cuenta de Mercadolibre.",
		};
	}
}
