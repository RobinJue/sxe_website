<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/assets/SxE%20Logo.png" />
	<!-- Cookiebot disabled for now - can be re-enabled later if needed
	<script
		id="Cookiebot"
		src="https://consent.cookiebot.com/uc.js"
		data-cbid="806d9233-dbe3-4666-97ee-2cb393327c27"
		data-blockingmode="auto"
		type="text/javascript"
	></script>
	-->
	<script>
		(() => {
			const storageKey = "sxe-theme";
			const root = document.documentElement;

			try {
				const stored = localStorage.getItem(storageKey);
				const mode = stored === "dark" ? "dark" : "light";
				root.classList.toggle("dark", mode === "dark");
				root.style.colorScheme = mode;
			} catch {
				root.classList.remove("dark");
				root.style.colorScheme = "light";
			}
		})();
	</script>
</svelte:head>

{@render children()}
