import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get("token") ?? "";

	if (!token) {
		return { valid: false, token: "" };
	}

	const rows = await sql`select 1 from subscribers where unsubscribe_token = ${token}`;

	return { valid: rows.length > 0, token };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const token = String(form.get("token") ?? "");

		if (!token) {
			return fail(400, { deleted: false });
		}

		await sql`delete from subscribers where unsubscribe_token = ${token}`;

		return { deleted: true };
	}
};
