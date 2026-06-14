<script lang="ts">
	import { Mail } from "lucide-svelte";
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

	// Flatten all partners from all tiers
	const allPartners = $derived(
		landing.partners.tiers.flatMap((tier) => tier.items)
	);
</script>

<svelte:head>
	<title>{t(landing.partners.title)}</title>
</svelte:head>

<section class="panel section-panel reveal" aria-labelledby="partners-title">
	<div class="partners-header">
		<h2 id="partners-title">{t(landing.partners.title)}</h2>
		<p class="intro-text">{t(landing.partners.intro)}</p>
	</div>

	<div class="logos-grid">
		{#each allPartners as partner (partner.name)}
			<a
				class="logo-link"
				href={partner.url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`Visit ${partner.name}`}
			>
				{#if partner.logo}
					<img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" />
				{:else}
					<span class="logo-placeholder">{partner.name}</span>
				{/if}
			</a>
		{/each}
	</div>

	<section class="partners-cta" aria-labelledby="partnership-cta">
		<h3 id="partnership-cta">{t(landing.partners.ctaTitle)}</h3>
		<p>{t(landing.partners.ctaDescription)}</p>
		<a href="/kontakt" class="cta-button">
			<Mail size={14} /> {t(landing.partners.ctaButtonLabel)}
		</a>
	</section>
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
		gap: 2.5rem;
		padding: clamp(1.1rem, 3vw, 2rem);
	}

	.partners-header {
		display: grid;
		gap: 1rem;
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	h2 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-size: clamp(1.65rem, 3vw, 2.75rem);
		line-height: 1.05;
		margin: 0;
	}

	.intro-text {
		color: var(--copy-muted);
		font-size: clamp(0.95rem, 1.5vw, 1.1rem);
		line-height: 1.5;
		margin: 0;
	}

	.logos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 2rem;
		align-items: center;
		justify-items: center;
	}

	.logo-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 80px;
		padding: 1rem;
		border-radius: 0.65rem;
		background: rgb(var(--rgb-white) / 0.05);
		border: 1px solid rgb(var(--rgb-white) / 0.1);
		transition: all 0.25s ease;
		text-decoration: none;
	}

	.logo-link:hover {
		background: rgb(var(--rgb-white) / 0.1);
		border-color: rgb(var(--rgb-brand-blue) / 0.5);
		transform: scale(1.05);
	}

	.logo-link img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		width: auto;
		height: auto;
	}

	.logo-placeholder {
		color: var(--copy-muted);
		font-size: 0.75rem;
		font-weight: 600;
		text-align: center;
	}

	.partners-cta {
		display: grid;
		gap: 0.8rem;
		margin-top: 1rem;
		padding: 1.5rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		text-align: center;
	}

	.partners-cta h3 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-size: 1rem;
		margin: 0;
	}

	.partners-cta p {
		color: var(--copy-muted);
		font-size: 0.88rem;
		margin: 0;
		line-height: 1.5;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		width: fit-content;
		margin: 0 auto;
		padding: 0.6rem 1rem;
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
		transform: translateY(-1px);
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

	:global(html:not(.dark)) .logo-link {
		background: rgb(var(--rgb-white) / 0.7);
		border-color: rgb(176 112 24 / 0.18);
	}

	:global(html:not(.dark)) .logo-link:hover {
		background: rgb(var(--rgb-white) / 0.85);
	}

	:global(html:not(.dark)) .partners-cta {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.96), rgb(255 238 214 / 0.48));
	}

	:global(html:not(.dark)) .partners-cta p {
		color: rgb(64 84 114);
	}

	@media (max-width: 900px) {
		.logos-grid {
			grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
			gap: 1.5rem;
		}

		.logo-link {
			height: 70px;
		}
	}

	@media (max-width: 640px) {
		.section-panel {
			padding: 1rem;
			gap: 1.5rem;
		}

		.logos-grid {
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
			gap: 1rem;
		}

		.logo-link {
			height: 60px;
		}

		.partners-header {
			gap: 0.8rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
