import type { PageServerLoad } from "./$types";

import { getHomeContent } from "$lib/cms/service";

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		content: await getHomeContent(fetch)
	};
};
