<script lang="ts">
	import { Rocket, ExternalLink } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();
	let language = $state<"de" | "en">("de");

	function t(value: { de: string; en: string }): string {
		return value[language];
	}

	function getStoredLanguage(): "de" | "en" {
		if (typeof window === "undefined") return "de";
		try {
			return window.localStorage.getItem("sxe-language") === "en" ? "en" : "de";
		} catch {
			return "de";
		}
	}

	$effect(() => {
		if (typeof window === "undefined") return;
		language = getStoredLanguage();
		document.documentElement.lang = language;
	});

	const content = $derived(data.content);
	const landing = $derived(content.landing);

	function resourceLogoUrl(url: string): string {
		try {
			const hostname = new URL(url).hostname.replace(/^www\./, "");
			return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=96`;
		} catch {
			return "/assets/SxE%20Logo.png";
		}
	}
</script>

<svelte:head>
	<title>{language === "de" ? "SxE: Ressourcen" : "SxE: Resources"}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<section class="panel section-panel reveal" aria-labelledby="resources-title">
	<div class="section-head">
		<p class="kicker"><Rocket size={14} strokeWidth={2.2} /> {t(landing.resources.kicker)}</p>
		<h2 id="resources-title">{t(landing.resources.title)}</h2>
		{#if landing.resources.lead}
			<p class="lead">{t(landing.resources.lead)}</p>
		{/if}
	</div>
	<div class="resource-category-grid">
		{#each landing.resources.categories as category (t(category.title))}
			<section class="resource-category" aria-labelledby={`resource-${t(category.title)}`}>
				<h3 id={`resource-${t(category.title)}`}>{t(category.title)}</h3>
				<div class="resource-grid">
					{#each category.items as item (item.name)}
						<a class="resource-card" href={item.url} target="_blank" rel="noopener noreferrer">
							<span class="resource-card-head">
								<span class="resource-logo" aria-hidden="true">
									<img src={resourceLogoUrl(item.url)} alt="" loading="lazy" decoding="async" />
								</span>
								<strong>{item.name}</strong>
							</span>
							<span>{t(item.description)}</span>
							<span class="resource-external" aria-hidden="true">
								<ExternalLink size={14} />
							</span>
						</a>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</section>

<style>
	.panel {
		width: 100%;
		border: 1px solid var(--line-soft);
		border-radius: 0.9rem;
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.09), rgb(var(--rgb-white) / 0.035)),
			var(--shell-1);
		box-shadow:
			0 24px 50px rgb(var(--rgb-black) / 0.24),
			inset 0 1px 0 rgb(var(--rgb-white) / 0.1);
	}

	.section-panel {
		display: grid;
		gap: 1.15rem;
		padding: clamp(1.1rem, 3vw, 2rem);
	}

	.section-head {
		display: grid;
		gap: 0.75rem;
	}

	.kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.42rem;
		width: fit-content;
		margin: 0;
		color: rgb(255 205 130);
		font-size: 0.78rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	h2,
	h3,
	p {
		margin: 0;
	}

	h2,
	h3 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-weight: 600;
	}

	h2 {
		font-size: clamp(1.65rem, 3vw, 2.75rem);
		line-height: 1.05;
	}

	#resources-title {
		max-width: 20ch;
		font-size: clamp(2rem, 5.8vw, 4.3rem);
		line-height: 1;
		white-space: pre-line;
	}

	.lead {
		color: var(--copy-muted);
		max-width: 66ch;
		font-size: clamp(1rem, 1.5vw, 1.15rem);
	}

	.resource-category-grid {
		display: grid;
		gap: 1rem;
	}

	.resource-category {
		display: grid;
		gap: 0.75rem;
	}

	.resource-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 0.85rem;
	}

	.resource-card {
		position: relative;
		display: grid;
		gap: 0.4rem;
		min-height: 9rem;
		padding: 1rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		text-decoration: none;
		color: var(--copy-muted);
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.resource-card:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.resource-card-head {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
	}

	.resource-logo {
		display: grid;
		flex: 0 0 auto;
		width: 2.4rem;
		height: 2.4rem;
		place-items: center;
		border: 1px solid rgb(var(--rgb-white) / 0.14);
		border-radius: 0.65rem;
		background: rgb(var(--rgb-white) / 0.9);
	}

	.resource-logo img {
		display: block;
		width: 1.55rem;
		height: 1.55rem;
		object-fit: contain;
	}

	.resource-card strong {
		color: rgb(var(--rgb-text-bright-dark));
	}

	.resource-external {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		color: rgb(255 205 130);
	}

	.reveal {
		opacity: 0;
		transform: translateY(18px);
		animation: reveal-up 640ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
	}

	@keyframes reveal-up {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(html:not(.dark)) .panel {
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5)),
			rgb(var(--rgb-white));
	}

	:global(html:not(.dark)) h2,
	:global(html:not(.dark)) h3 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .resource-card {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
		color: rgb(64 84 114);
	}

	:global(html:not(.dark)) .resource-card strong {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .resource-logo {
		border-color: rgb(176 112 24 / 0.2);
		background: rgb(var(--rgb-white) / 0.96);
	}

	@media (max-width: 640px) {
		.section-panel {
			padding: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
