<script lang="ts">
	import { Mail, Handshake, ArrowRight } from "lucide-svelte";
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

	// Get tiers and partners
	const silverTier = $derived(landing.partners.tiers.find((t) => t.id === "silver") || {});
	const bronzeTier = $derived(landing.partners.tiers.find((t) => t.id === "bronze") || {});
	const silverPartners = $derived(silverTier.items || []);
	const bronzePartners = $derived(bronzeTier.items || []);
</script>

<svelte:head>
	<title>{language === "de" ? "SxE: Partner" : "SxE: Partners"}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="partners-page">
	<section class="panel partners-hero" aria-labelledby="partners-hero-title">
		<div class="hero-copy">
			<p class="kicker"><Handshake size={14} strokeWidth={2.2} /> {t(landing.partners.kicker)}</p>
			<h1 id="partners-hero-title">{t(landing.partners.heroTitle)}</h1>
			<p class="lead">{t(landing.partners.heroLead)}</p>
			<div class="hero-actions">
				<a href="/kontakt" class="button button-primary">{t(landing.partners.heroCtaLabel)} <ArrowRight size={16} /></a>
			</div>
		</div>
	</section>

	{#if silverPartners.length > 0}
		<section class="partner-block" aria-labelledby="silver-title">
			<div class="block-content">
				<div class="block-text">
					<h2 id="silver-title">{silverTier.title ? t(silverTier.title) : t(landing.partners.title)}</h2>
					<p class="block-description">{silverTier.description ? t(silverTier.description) : t(landing.partners.intro)}</p>
				</div>
				<div class="block-logos">
					{#each silverPartners as partner (partner.name)}
						<a
							class="logo-item"
							href={partner.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Visit ${partner.name}`}
							title={partner.name}
						>
							{#if partner.logo}
								<img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" />
							{:else}
								<span class="logo-fallback">{partner.name}</span>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	{#if bronzePartners.length > 0}
		<section class="partner-block" aria-labelledby="bronze-title">
			<div class="block-content">
				<div class="block-text">
					<h2 id="bronze-title">{bronzeTier.title ? t(bronzeTier.title) : (language === "de" ? "Wir führen Workshops durch" : "We conduct workshops")}</h2>
					<p class="block-description">{bronzeTier.description ? t(bronzeTier.description) : (language === "de" ? "Mit praktischen Formaten unterstützen wir Wissenschaftler bei ihren ersten Schritten in Richtung Gründung." : "Through practical formats, we support scientists in their first steps towards entrepreneurship.")}</p>
				</div>
				<div class="block-logos">
					{#each bronzePartners as partner (partner.name)}
						<a
							class="logo-item"
							href={partner.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Visit ${partner.name}`}
							title={partner.name}
						>
							{#if partner.logo}
								<img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" />
							{:else}
								<span class="logo-fallback">{partner.name}</span>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<section class="partners-cta" aria-labelledby="partnership-cta">
		<h3 id="partnership-cta">{t(landing.partners.ctaTitle)}</h3>
		<p>{t(landing.partners.ctaDescription)}</p>
		<a
			href="mailto:robin.juengerich@icloud.com?subject=SxE%20Partnership%20request"
			class="cta-button"
		>
			<Mail size={14} /> {t(landing.partners.ctaButtonLabel)}
		</a>
	</section>
</div>

<style>
	.partners-page {
		display: grid;
		gap: 2rem;
	}

	.partner-block {
		width: 100%;
		border: 1px solid var(--line-soft);
		border-radius: 0.9rem;
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.09), rgb(var(--rgb-white) / 0.035)),
			var(--shell-1);
		box-shadow:
			0 24px 50px rgb(var(--rgb-black) / 0.24),
			inset 0 1px 0 rgb(var(--rgb-white) / 0.1);
		padding: clamp(1.5rem, 3vw, 2.5rem);
	}

	.block-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
	}

	.block-text {
		display: grid;
		gap: 1rem;
	}

	h2 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		font-weight: 600;
		line-height: 1.1;
		margin: 0;
	}

	.block-description {
		color: var(--copy-muted);
		font-size: clamp(0.95rem, 1.2vw, 1.05rem);
		line-height: 1.6;
		margin: 0;
	}

	.block-logos {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1.5rem;
		align-items: center;
		justify-items: center;
	}

	.logo-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		aspect-ratio: 1;
		padding: 0.8rem;
		border-radius: 0.65rem;
		background: rgb(var(--rgb-white) / 0.05);
		border: 1px solid rgb(var(--rgb-white) / 0.1);
		transition: all 0.25s ease;
		text-decoration: none;
		cursor: pointer;
	}

	.logo-item:hover {
		background: rgb(var(--rgb-white) / 0.12);
		border-color: rgb(var(--rgb-brand-blue) / 0.6);
		transform: scale(1.08);
	}

	.logo-item img {
		max-width: 90%;
		max-height: 90%;
		object-fit: contain;
		width: auto;
		height: auto;
	}

	.logo-fallback {
		color: var(--copy-muted);
		font-size: 0.7rem;
		font-weight: 600;
		text-align: center;
		word-break: break-word;
	}

	.partners-cta {
		width: 100%;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		padding: 2rem;
		display: grid;
		gap: 1rem;
		text-align: center;
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.partners-cta:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.partners-cta h3 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0;
	}

	.partners-cta p {
		color: var(--copy-muted);
		font-size: 0.9rem;
		margin: 0;
		line-height: 1.6;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		width: fit-content;
		margin: 0 auto;
		padding: 0.7rem 1.2rem;
		border-radius: 999px;
		border: 1px solid rgb(var(--rgb-brand-blue) / 0.55);
		background: rgb(var(--rgb-brand-blue));
		color: rgb(22 22 18);
		font-weight: 800;
		font-size: 0.85rem;
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.cta-button:hover {
		transform: translateY(-2px);
	}

	/* Hero Section */
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

	.partners-hero {
		width: 100%;
		padding: clamp(2rem, 5vw, 3.5rem) clamp(1.1rem, 3vw, 2rem);
		display: grid;
		align-items: center;
	}

	.hero-copy {
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

	h1 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-weight: 600;
		letter-spacing: 0;
		margin: 0;
		max-width: 20ch;
		font-size: clamp(2rem, 5.8vw, 4.3rem);
		line-height: 1;
	}

	.lead {
		color: var(--copy-muted);
		max-width: 66ch;
		font-size: clamp(1rem, 1.5vw, 1.15rem);
		margin: 0;
	}

	.hero-actions {
		display: flex;
		gap: 0.7rem;
		margin-top: 0.25rem;
	}

	.button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.7rem 1.2rem;
		border-radius: 999px;
		font-weight: 800;
		font-size: 0.85rem;
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.button-primary {
		border: 1px solid rgb(var(--rgb-brand-blue) / 0.55);
		background: rgb(var(--rgb-brand-blue));
		color: rgb(22 22 18);
	}

	.button-primary:hover {
		transform: translateY(-2px);
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
	:global(html:not(.dark)) h2 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .partner-block {
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5)),
			rgb(var(--rgb-white));
	}

	:global(html:not(.dark)) h2 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .block-description {
		color: rgb(64 84 114);
	}

	:global(html:not(.dark)) .logo-item {
		background: rgb(var(--rgb-white) / 0.8);
		border-color: rgb(176 112 24 / 0.18);
	}

	:global(html:not(.dark)) .logo-item:hover {
		background: rgb(var(--rgb-white) / 0.95);
		border-color: rgb(var(--rgb-brand-blue) / 0.5);
	}

	:global(html:not(.dark)) .partners-cta {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
	}

	:global(html:not(.dark)) .partners-cta h3,
	:global(html:not(.dark)) .partners-cta p {
		color: rgb(18 37 63);
	}

	@media (max-width: 900px) {
		.block-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.block-logos {
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
			gap: 1rem;
		}
	}

	@media (max-width: 640px) {
		.partner-block {
			padding: 1.2rem;
		}

		h2 {
			font-size: 1.3rem;
		}

		.block-logos {
			grid-template-columns: repeat(3, 1fr);
			gap: 0.8rem;
		}

		.logo-item {
			padding: 0.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
