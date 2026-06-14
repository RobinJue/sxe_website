<script lang="ts">
	import { ArrowRight, Sparkles, Users } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();

	let language = $state<"de" | "en">("de");

	function t(value: { de: string; en: string }): string {
		return value[language];
	}

	function getStoredLanguage(): "de" | "en" {
		if (typeof window === "undefined") {
			return "de";
		}

		try {
			return window.localStorage.getItem("sxe-language") === "en" ? "en" : "de";
		} catch {
			return "de";
		}
	}

	$effect(() => {
		if (typeof window === "undefined") {
			return;
		}
		language = getStoredLanguage();
		document.documentElement.lang = language;
	});

	const content = $derived(data.content);
	const landing = $derived(content.landing);
	const podcastSettings = $derived(content.podcastSettings);
	const latestEpisode = $derived(content.podcastFeed.episodes[0]);
</script>

<svelte:head>
	<title>{t(landing.meta.title)}</title>
	<meta name="description" content={t(landing.meta.description)} />
	<meta property="og:title" content={t(landing.meta.title)} />
	<meta property="og:description" content={t(landing.meta.description)} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={landing.meta.ogImage} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Hero Section -->
<section class="panel hero-panel reveal" aria-labelledby="hero-title">
	<div class="hero-copy">
		<p class="kicker"><Sparkles size={14} strokeWidth={2.2} /> {t(landing.hero.kicker)}</p>
		<h1 id="hero-title" class:de-title={language === "de"}>{t(landing.hero.title)}</h1>
		<p class="lead">{t(landing.hero.lead)}</p>
		<div class="hero-actions">
			<a href={landing.hero.primaryHref} class="button button-primary"
				>{t(landing.hero.primaryLabel)} <ArrowRight size={16} /></a
			>
			<a href={landing.hero.secondaryHref} class="button button-ghost"
				>{t(landing.hero.secondaryLabel)}</a
			>
		</div>
	</div>

	<aside class="hero-visual" aria-label="SxE">
		<img
			class="hero-cover"
			src={podcastSettings.fallbackCover}
			alt={t(podcastSettings.title)}
			decoding="async"
			fetchpriority="high"
		/>
	</aside>
</section>

<!-- About Section -->
<section class="panel section-panel reveal" aria-labelledby="about-title">
	<div class="section-head">
		<p class="kicker"><Users size={14} strokeWidth={2.2} /> {t(landing.about.kicker)}</p>
		<h2 id="about-title">{t(landing.about.title)}</h2>
		<div class="lead rich-text">
			{#each t(landing.about.body).split("\n\n") as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>
	<div class="card-grid three">
		{#each landing.about.features as feature (t(feature.title))}
			<article class="content-card">
				<span class="card-icon" aria-hidden="true">{feature.icon}</span>
				<h3>{t(feature.title)}</h3>
				<p>{t(feature.text)}</p>
			</article>
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

	.hero-panel,
	.section-panel {
		display: grid;
		gap: 1.15rem;
		padding: clamp(1.1rem, 3vw, 2rem);
	}

	.hero-panel {
		grid-template-columns: minmax(0, 1.12fr) minmax(280px, 0.88fr);
		gap: clamp(1rem, 3vw, 2rem);
		align-items: center;
	}

	.hero-copy,
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
		border-radius: 999px;
		color: rgb(255 205 130);
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1,
	h2,
	h3 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		letter-spacing: 0;
	}

	h1 {
		max-width: 12ch;
		font-size: clamp(2.35rem, 7vw, 5.25rem);
		line-height: 0.96;
	}

	h1.de-title {
		max-width: 14ch;
		font-size: clamp(2rem, 5.8vw, 4.3rem);
		line-height: 1;
	}

	h2 {
		font-size: clamp(1.65rem, 3vw, 2.75rem);
		line-height: 1.05;
	}

	h3 {
		font-size: 1.05rem;
		line-height: 1.2;
	}

	.lead,
	.content-card p {
		color: var(--copy-muted);
	}

	.lead {
		max-width: 66ch;
		font-size: clamp(1rem, 1.5vw, 1.15rem);
	}

	.rich-text {
		display: grid;
		gap: 0.7rem;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		margin-top: 0.25rem;
	}

	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		min-height: 2.75rem;
		padding: 0.7rem 1rem;
		border-radius: 999px;
		font-weight: 800;
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
	}

	.button:hover {
		transform: translateY(-1px);
	}

	.button-primary {
		border: 1px solid rgb(var(--rgb-brand-blue) / 0.55);
		background: rgb(var(--rgb-brand-blue));
		color: rgb(22 22 18);
	}

	.button-ghost {
		border: 1px solid var(--line-soft);
		background: rgb(var(--rgb-white) / 0.06);
		color: rgb(var(--rgb-text-bright-dark));
	}

	.hero-visual {
		display: grid;
	}

	.hero-cover {
		display: block;
		width: min(100%, 28rem);
		justify-self: center;
		aspect-ratio: 1;
		border-radius: 0.85rem;
		border: 1px solid var(--line-soft);
		object-fit: cover;
		box-shadow: 0 24px 38px rgb(var(--rgb-black) / 0.24);
	}

	.card-grid {
		display: grid;
		gap: 0.85rem;
	}

	.card-grid.three {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.content-card {
		display: grid;
		gap: 0.45rem;
		padding: 1rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.content-card:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.card-icon {
		font-size: 1.55rem;
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
		box-shadow:
			0 20px 32px rgb(var(--rgb-slate-900) / 0.08),
			inset 0 1px 0 rgb(var(--rgb-white) / 0.8);
	}

	:global(html:not(.dark)) h1,
	:global(html:not(.dark)) h2,
	:global(html:not(.dark)) h3 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .button-ghost {
		border-color: rgb(176 112 24 / 0.24);
		background: rgb(255 248 238 / 0.88);
		color: rgb(111 70 17);
	}

	:global(html:not(.dark)) .button-ghost:hover {
		background: rgb(255 226 184 / 0.82);
	}

	:global(html:not(.dark)) .content-card {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.96), rgb(255 238 214 / 0.48));
	}

	@media (max-width: 900px) {
		.hero-panel,
		.section-panel {
			grid-template-columns: 1fr;
		}

		.card-grid.three {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.hero-panel,
		.section-panel {
			padding: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
			scroll-behavior: auto !important;
		}
	}
</style>
