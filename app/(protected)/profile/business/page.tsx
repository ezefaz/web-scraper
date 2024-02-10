"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { getMLUserCode } from "@/app/actions/get-ml-user-code";

type UserProfile = {
	id: number;
	first_name: string;
	last_name: string;
	nickname: string;
	registration_date: string;
	gender: string;
	country_id: string;
	email: string;
	// ... other fields
};

type Props = {};

const BusinessProfilePage = (props: Props) => {
	const [userData, setUserData] = useState<UserProfile | null>(null);
	const searchParams = useSearchParams();

	const code = searchParams.get("code");

	useEffect(() => {
		const fetchData = async () => {
			try {
				// const response = await axios.get(`/api/mercadolibre?code0${code}`);

				const response: any = await getMLUserCode(code);

				setUserData(response);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchData();
	}, []);

	console.log("DATUUUN", userData);

	return (
		<div>
			<h1>Business Profile Page</h1>
			{userData ? (
				<div>
					{/* Display user profile information here */}
					<p>Primer Nombre: {userData.first_name}</p>
					<p>Nickname: {userData.nickname}</p>
					<p>Registration Date: {userData.registration_date}</p>
					{/* ... other fields */}
				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	);
};

export default BusinessProfilePage;
