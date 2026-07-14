import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { sendWelcomeEmail } from "$lib/server/mailer";

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get("token");

	if (!token) {
		return { status: "invalid" as const };
	}

	const existing = await sql<{ email: string; confirmed: boolean }[]>`
		select email, confirmed from subscribers where unsubscribe_token = ${token}
	`;
	const subscriber = existing[0];

	if (!subscriber) {
		return { status: "invalid" as const };
	}

	if (!subscriber.confirmed) {
		await sql`
			update subscribers set confirmed = true, confirmed_at = now()
			where unsubscribe_token = ${token}
		`;

		try {
			await sendWelcomeEmail(subscriber.email, token, url.origin);
		} catch {
			// Confirmation still succeeded even if the welcome email fails to send.
		}
	}

	return { status: "confirmed" as const };
};
