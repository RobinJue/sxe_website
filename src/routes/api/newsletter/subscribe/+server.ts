import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "$lib/server/db";
import { sendConfirmationEmail } from "$lib/server/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: RequestHandler = async ({ request, url }) => {
	const form = await request.formData();
	const email = String(form.get("email") ?? "").trim().toLowerCase();
	const source = String(form.get("source") ?? "unknown").slice(0, 64);
	// Honeypot field — real visitors never fill this in, bots usually do.
	const honeypot = String(form.get("company") ?? "");

	if (honeypot) {
		return json({ ok: true });
	}

	if (!EMAIL_RE.test(email)) {
		return json({ ok: false, error: "invalid-email" }, { status: 400 });
	}

	const rows = await sql<{ unsubscribe_token: string; confirmed: boolean }[]>`
		insert into subscribers (email, source)
		values (${email}, ${source})
		on conflict (email) do update set consent_at = now()
		returning unsubscribe_token, confirmed
	`;

	const row = rows[0];

	if (!row.confirmed) {
		try {
			await sendConfirmationEmail(email, row.unsubscribe_token, url.origin);
		} catch (err) {
			// The subscriber is already stored — don't fail the signup just because
			// the confirmation mail couldn't go out (e.g. mailer isn't configured yet).
			console.error("Failed to send newsletter confirmation email:", err);
		}
	}

	return json({ ok: true });
};
