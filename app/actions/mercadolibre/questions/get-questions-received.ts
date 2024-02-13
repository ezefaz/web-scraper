import axios from "axios";

// interface UserViewsResponse {
// 	user_id: number;
// 	date_from: string;
// 	date_to: string;
// 	total_visits: number;
// 	visits_detail: any[];
// }

export async function getMLQuestionsReceived(siteId: string) {
  try {
    const response = await axios(
      `https://api.mercadolibre.com/my/received_questions/search`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );

    let questions = await response.data;

    if (!questions) {
      return { error: "No se pudieron obtener las preguntas recibidas." };
    }

    return questions;
  } catch (error) {
    console.error("[ERROR_GETTING_QUESTIONS]", error);
    return { error: "Error al obtener las preguntas recibidas del usuario." };
  }
}
