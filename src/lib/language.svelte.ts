let current = $state<"de" | "en">("de");

function init() {
	if (typeof window === "undefined") return;
	try {
		current = window.localStorage.getItem("sxe-language") === "en" ? "en" : "de";
		document.documentElement.lang = current;
	} catch {
		current = "de";
	}
}

function set(value: "de" | "en") {
	current = value;
	try {
		if (typeof window !== "undefined") {
			window.localStorage.setItem("sxe-language", value);
			document.documentElement.lang = value;
		}
	} catch {}
}

function t(value: { de: string; en: string }): string {
	return value[current];
}

export const lang = {
	get current() {
		return current;
	},
	init,
	set,
	t
};
