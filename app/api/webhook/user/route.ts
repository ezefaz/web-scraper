import User from "@/lib/models/user.model";
import { clerkClient } from "@clerk/nextjs/server";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";

interface EmailAddress {
	email_address: string;
	id: string;
	linked_to: any[];
	object: string;
	reserved: boolean;
	verification: {
		[key: string]: any;
	};
}

interface Attributes {
	id: string;
	first_name: string;
	profile_image_url: string;
	email_addresses: EmailAddress[];
	external_accounts: any[];
}

type EventType = "user.created" | "user.updated" | "*";

type Event = {
	data: Record<string, string | number>;
	object: "event";
	type: EventType;
};

const webhookSecret = process.env.WEBHOOK_SECRET || "";

async function handler(request: Request) {
	const payload = await request.json();
	const headersList = headers();
	const heads = {
		"svix-id": headersList.get("svix-id"),
		"svix-timestamp": headersList.get("svix-timestamp"),
		"svix-signature": headersList.get("svix-signature"),
	};
	const wh = new Webhook(webhookSecret);
	let evt: any | null = null;

	try {
		evt = wh.verify(
			JSON.stringify(payload),
			heads as IncomingHttpHeaders & WebhookRequiredHeaders
		) as Event;
	} catch (err) {
		console.error((err as Error).message);
		return NextResponse.json({}, { status: 400 });
	}

	const eventType = evt.type;
	if (eventType === "user.created" || eventType === "user.updated") {
		const { id, ...attributes } = evt.data;

		try {
			const existingUser = await User.findOne({
				email: attributes.email_addresses[0]?.email_address,
			});

			if (existingUser) {
				existingUser.name = attributes.first_name;
				existingUser.email =
					attributes.email_addresses[0]?.email_address || existingUser.email;
				existingUser.image = attributes.profile_image_url || existingUser.image;

				await existingUser.save();

				return NextResponse.json({
					message: "El usuario fue actualizado con éxito.",
					data: existingUser,
				});
			} else {
				const newUser = new User({
					name: attributes.first_name,
					email: attributes.email_addresses[0]?.email_address,
					image: attributes.profile_image_url || "",
				});

				await newUser.save();

				return NextResponse.json({
					message: "El usuario fue creado con éxito.",
					data: newUser,
				});
			}
		} catch (error) {
			console.error("[WEBHOOK_USER]", error);
			return NextResponse.json({
				message: "Ha ocurrido un error al procesar la solicitud.",
				data: null,
			});
		}
	}
	return NextResponse.json({
		message: "Unhandled scenario or no action taken.",
		data: null,
	});
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
