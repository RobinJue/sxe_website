<script lang="ts">
	import { Heart, Mail } from "lucide-svelte";
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

	function partnerLogoUrl(url: string): string {
		try {
			const hostname = new URL(url).hostname.replace(/^www\./, "");
			return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
		} catch {
			return "/assets/SxE%20Logo.png";
		}
	}
</script>

<svelte:head>
	<title>{t(landing.partners.title)}</title>
</svelte:head>

<section class="panel section-panel reveal" aria-labelledby="partners-title">
	<div class="section-head">
		<p class="kicker"><Heart size={14} strokeWidth={2.2} /> {t(landing.partners.kicker)}</p>
		<h2 id="partners-title">{t(landing.partners.title)}</h2>
		<p class="lead">{t(landing.partners.intro)}</p>
	</div>

	<div class="partners-container">
		{#each landing.partners.tiers as tier (t(tier.name))}
			<section class="partners-tier" aria-labelledby={`tier-${tier.id}`}>
				<h3 id={`tier-${tier.id}`}>{t(tier.name)}</h3>
				{#if tier.items.length > 0}
					<div class="partners-grid">
						{#each tier.items as partner (partner.name)}
							<a
								class="partner-card"
								href={partner.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={partner.name}
							>
								<span class="partner-logo">
									<img
										src={partnerLogoUrl(partner.url)}
										alt={partner.name}
										loading="lazy"
										decoding="async"
									/>
								</span>
								<span class="partner-name">{partner.name}</span>
							</a>
						{/each}
					</div>
				{:else}
					<p class="no-partners">{t(landing.partners.comingSoon)}</p>
				{/if}
			</section>
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
	}

	h2 {
		font-size: clamp(1.65rem, 3vw, 2.75rem);
		line-height: 1.05;
	}

	.lead {
		color: var(--copy-muted);
		font-size: clamp(1rem, 1.5vw, 1.15rem);
	}

	.partners-container {
		display: grid;
		gap: 1.5rem;
	}

	.partners-tier {
		display: grid;
		gap: 0.75rem;
	}

	.partners-tier h3 {
		font-size: 1rem;
		color: rgb(255 205 130);
	}

	.partners-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
	}

	.partner-card {
		display: grid;
		place-items: center;
		gap: 0.6rem;
		padding: 1.2rem 0.8rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		text-decoration: none;
		color: var(--copy-muted);
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.partner-card:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.partner-logo {
		display: grid;
		width: 3.5rem;
		height: 3.5rem;
		place-items: center;
		border-radius: 0.65rem;
		background: rgb(var(--rgb-white) / 0.9);
	}

	.partner-logo img {
		display: block;
		width: 2.4rem;
		height: 2.4rem;
		object-fit: contain;
	}

	.partner-name {
		font-size: 0.82rem;
		font-weight: 600;
		color: rgb(var(--rgb-text-bright-dark));
		text-align: center;
		word-break: break-word;
	}

	.no-partners {
		color: var(--copy-muted);
		font-size: 0.88rem;
		font-style: italic;
		padding: 1rem;
	}

	.partners-cta {
		display: grid;
		gap: 0.6rem;
		margin-top: 1rem;
		padding: 1.5rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
	}

	.partners-cta h3 {
		font-size: 1rem;
	}

	.partners-cta p {
		color: var(--copy-muted);
		font-size: 0.88rem;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		width: fit-content;
		padding: 0.6rem 1rem;
		margin-top: 0.5rem;
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

	:global(html:not(.dark)) .partner-card,
	:global(html:not(.dark)) .partners-cta {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.96), rgb(255 238 214 / 0.48));
	}

	:global(html:not(.dark)) .partner-logo {
		background: rgb(var(--rgb-white) / 0.96);
	}

	:global(html:not(.dark)) .partner-name {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .partners-cta p {
		color: rgb(64 84 114);
	}

	@media (max-width: 640px) {
		.section-panel {
			padding: 1rem;
		}

		.partners-grid {
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
			gap: 0.75rem;
		}

		.partner-card {
			padding: 0.8rem 0.6rem;
		}

		.partner-logo {
			width: 2.8rem;
			height: 2.8rem;
		}

		.partner-logo img {
			width: 1.8rem;
			height: 1.8rem;
		}

		.partner-name {
			font-size: 0.75rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
