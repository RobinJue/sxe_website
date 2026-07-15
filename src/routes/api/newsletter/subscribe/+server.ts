import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "$lib/server/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: RequestHandler = async ({ request }) => {
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

	// Confirmation email is disabled for now — GMAIL_USER/GMAIL_APP_PASSWORD
	// aren't configured yet, so we just store the subscriber. Re-enable the
	// sendConfirmationEmail call (see git history) once mailer credentials
	// are set on Railway.
	await sql`
		insert into subscribers (email, source)
		values (${email}, ${source})
		on conflict (email) do update set consent_at = now()
	`;

	return json({ ok: true });
};
