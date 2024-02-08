const express = require("express");
const axios = require("axios");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const corsOptions = {
	origin: "http://localhost:3000",
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

const APP_ID = process.env.MERCADOLIBRE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.MERCADOLIBRE_CLIENT_SECRET || "";
const REDIRECT_URL =
	"https://db82-2800-40-3c-a31-292f-c798-14ba-91ee.ngrok-free.app/api/meli";

// Route to obtain the code
app.get("/", (req, res) => {
	const redirectURL = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=7423381817150989&redirect_uri=https://db82-2800-40-3c-a31-292f-c798-14ba-91ee.ngrok-free.app/api/meli`;

	res.redirect(redirectURL);
});

// Route to generate the token
// app.get("meli", async (req, res) => {
// 	const code = req.query.code;

// 	const body = new URLSearchParams({
// 		grant_type: "authorization_code",
// 		client_id: "7423381817150989",
// 		client_secret: "ueOGFqfmUl1CGxl4dHHx5BIkU1AdbeC2",
// 		redirect_uri:
// 			"https://db82-2800-40-3c-a31-292f-c798-14ba-91ee.ngrok-free.app/api/meli",
// 		code: code,
// 	});

// 	try {
// 		const response = await axios.post(
// 			"https://api.mercadolibre.com/oauth/token",
// 			body,
// 			{
// 				headers: {
// 					"Content-Type": "application/x-www-form-urlencoded",
// 					Accept: "application/json",
// 				},
// 			}
// 		);

// 		const data = response.data;
// 		res.status(200).json({ response: "success", data });
// 	} catch (error) {
// 		console.error("Error fetching token:", error);
// 		res.status(500).json({ response: "error", error: "Internal Server Error" });
// 	}
// });

// Obtain user info
app.get("/api/meli", async (req, res) => {
	const code = req.query.code;

	const body = new URLSearchParams({
		grant_type: "authorization_code",
		client_id: "7423381817150989",
		client_secret: "ueOGFqfmUl1CGxl4dHHx5BIkU1AdbeC2",
		redirect_uri:
			"https://db82-2800-40-3c-a31-292f-c798-14ba-91ee.ngrok-free.app/api/meli",
		code: code,
	});

	try {
		const response = await axios.post(
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

		// Realizar solicitud a la API para obtener información del usuario
		const userResponse = await axios.get(
			"https://api.mercadolibre.com/users/me",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const userData = userResponse.data;
		res.status(200).json({ response: "success", data: userData });
	} catch (error) {
		console.error("Error fetching data:", error);
		res.status(500).json({ response: "error", error: "Internal Server Error" });
	}
});

// Start the server
const port = process.env.PORT || 3008;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
