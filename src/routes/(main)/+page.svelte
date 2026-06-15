<script lang="ts">
	import { ArrowRight, Sparkles, Users, Compass, BookOpen } from "lucide-svelte";
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

	// Get all partners flattened for carousel
	const allPartners = $derived(
		landing.partners.tiers.flatMap(tier => tier.items)
	);

	const featureIcons = { Compass, Users, BookOpen };


</script>

<svelte:head>
	<title>{language === "de" ? "SxE: Home" : "SxE: Home"}</title>
	<meta name="description" content={t(landing.meta.description)} />
	<meta property="og:title" content={t(landing.meta.title)} />
	<meta property="og:description" content={t(landing.meta.description)} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={landing.meta.ogImage} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Hero Section -->
<section class="panel hero-panel reveal" aria-labelledby="hero-title">
	<div class="hero-copy">
		<p class="kicker"><Sparkles size={14} strokeWidth={2.2} /> {t(landing.hero.kicker)}</p>
		<h1 id="hero-title">{t(landing.hero.title)}</h1>
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
</section>

<!-- Social Proof Section -->
{#if landing.socialProof}
	<section class="panel social-proof-panel reveal" aria-labelledby="social-proof-label">
		<div class="social-proof-content">
			<span class="proof-number">{landing.socialProof.number}</span>
			<p id="social-proof-label" class="proof-label">{t(landing.socialProof.label)}</p>
		</div>
	</section>
{/if}

<!-- Partner Carousel Section -->
{#if allPartners.length > 0}
	<section class="panel carousel-panel reveal" aria-labelledby="partners-carousel-title">
		<h2 id="partners-carousel-title" class="carousel-title">
			{language === "de" ? "Unterstützt von & in Zusammenarbeit mit" : "Supported by & in collaboration with"}
		</h2>
		<div class="carousel-container">
			<div class="carousel-scroll">
				{#each allPartners as partner (partner.name)}
					<a
						class="carousel-item"
						href={partner.url}
						target="_blank"
						rel="noopener noreferrer"
						title={partner.name}
					>
						{#if partner.logo}
							<img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" />
						{:else}
							<span class="logo-fallback">{partner.name}</span>
						{/if}
					</a>
				{/each}
				{#each allPartners as partner (partner.name)}
					<a
						class="carousel-item"
						href={partner.url}
						target="_blank"
						rel="noopener noreferrer"
						title={partner.name}
						aria-hidden="true"
						tabindex="-1"
					>
						{#if partner.logo}
							<img src={partner.logo} alt="" loading="lazy" decoding="async" />
						{:else}
							<span class="logo-fallback">{partner.name}</span>
						{/if}
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- About Section (Angebote) -->
<section
	class="panel section-panel reveal"
	aria-label={language === "de" ? "Unsere Angebote" : "What we offer"}
>
	<div class="card-grid three">
		{#each landing.about.features as feature (t(feature.title))}
			{@const Icon = featureIcons[feature.icon]}
			<article class="content-card">
				<span class="card-icon" aria-hidden="true"><Icon size={28} strokeWidth={1.75} /></span>
				<h3>{t(feature.title)}</h3>
				<p>{t(feature.text)}</p>
			</article>
		{/each}
	</div>
</section>

<!-- Testimonial Section -->
{#if landing.testimonial}
	<section class="panel testimonial-panel reveal" aria-labelledby="testimonial-quote">
		{#if landing.testimonial.photo}
			<img src={landing.testimonial.photo} alt={landing.testimonial.author} class="testimonial-image" />
		{/if}
		<blockquote class="testimonial-content">
			<p id="testimonial-quote" class="testimonial-quote">"<em>{t(landing.testimonial.quote)}</em>"</p>
			<footer class="testimonial-footer">
				<div class="testimonial-author">
					<strong>{landing.testimonial.author}</strong>
					<span class="testimonial-title">{t(landing.testimonial.title)}</span>
				</div>
				<p class="testimonial-attribution">{t(landing.testimonial.attribution)}</p>
			</footer>
		</blockquote>
	</section>
{/if}

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
		grid-template-columns: 1fr;
		gap: clamp(1rem, 3vw, 2rem);
		align-items: center;
		padding: clamp(2rem, 5vw, 3.5rem) clamp(1.1rem, 3vw, 2rem);
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
		font-weight: 600;
		letter-spacing: 0;
	}

	h1 {
		max-width: 20ch;
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

	/* Social Proof Section */
	.social-proof-panel {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(2rem, 4vw, 3.5rem);
		text-align: center;
	}

	.social-proof-content {
		display: grid;
		gap: 0.5rem;
	}

	.proof-number {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 800;
		color: rgb(var(--rgb-text-bright-dark));
		line-height: 1;
	}

	.proof-label {
		color: var(--copy-muted);
		font-size: clamp(0.95rem, 1.5vw, 1.1rem);
		line-height: 1.6;
	}

	/* Carousel Section */
	.carousel-panel {
		padding: clamp(2rem, 4vw, 3rem);
		min-width: 0;
	}

	.carousel-title {
		text-align: center;
		margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
		font-size: clamp(1.2rem, 2vw, 1.65rem);
	}

	.carousel-container {
		overflow: hidden;
	}

	.carousel-scroll {
		display: flex;
		width: max-content;
		align-items: center;
		padding: 0.5rem 0;

		/* Smooth scrolling animation */
		animation: carousel-scroll 60s linear infinite;
	}

	.carousel-scroll:hover {
		animation-play-state: paused;
	}

	.carousel-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(100px, 15vw, 160px);
		height: clamp(60px, 8vw, 100px);
		margin-right: clamp(1rem, 3vw, 2rem);
		padding: 0.8rem;
		border-radius: 0.65rem;
		background: rgb(var(--rgb-white) / 0.05);
		border: 1px solid rgb(var(--rgb-white) / 0.1);
		transition: all 0.25s ease;
		text-decoration: none;
		cursor: pointer;
		flex-shrink: 0;
	}

	.carousel-item:hover {
		background: rgb(var(--rgb-white) / 0.12);
		border-color: rgb(var(--rgb-brand-blue) / 0.6);
		transform: scale(1.08);
	}

	.carousel-item img {
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

	@keyframes carousel-scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	/* Testimonial Section */
	.testimonial-panel {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2.5rem;
		align-items: center;
		padding: clamp(2.5rem, 5vw, 4rem);
		max-width: 100%;
		overflow: hidden;
	}

	.testimonial-content {
		max-width: 800px;
		margin: 0 auto;
		display: grid;
		gap: 2rem;
	}

	.testimonial-quote {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		line-height: 1.25;
		font-weight: 600;
		color: rgb(var(--rgb-text-bright-dark));
	}

	.testimonial-footer {
		display: grid;
		gap: 0.75rem;
	}

	.testimonial-author {
		display: grid;
		gap: 0.25rem;
	}

	.testimonial-author strong {
		font-size: 1rem;
		font-weight: 800;
		color: rgb(var(--rgb-text-bright-dark));
	}

	.testimonial-title {
		font-size: 0.85rem;
		color: rgb(255 205 130);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.testimonial-image {
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 0.9rem;
		object-fit: cover;
		aspect-ratio: 1;
	}

	.testimonial-attribution {
		font-size: 0.85rem;
		color: var(--copy-muted);
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
		display: flex;
		align-items: center;
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
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
	}

	:global(html:not(.dark)) .proof-number,
	:global(html:not(.dark)) .testimonial-quote,
	:global(html:not(.dark)) .testimonial-author strong {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .carousel-item {
		background: rgb(var(--rgb-white) / 0.8);
		border-color: rgb(176 112 24 / 0.18);
	}

	:global(html:not(.dark)) .carousel-item:hover {
		background: rgb(var(--rgb-white) / 0.95);
		border-color: rgb(var(--rgb-brand-blue) / 0.5);
	}

	@media (max-width: 900px) {
		.hero-panel,
		.section-panel {
			grid-template-columns: 1fr;
		}

		.card-grid.three {
			grid-template-columns: 1fr;
		}

		.carousel-scroll {
			padding-bottom: 0.5rem;
		}
	}

	
	@media (max-width: 768px) {
		.testimonial-panel {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 640px) {
		.hero-panel,
		.section-panel {
			padding: 1rem;
		}

		.social-proof-panel,
		.carousel-panel,
		.testimonial-panel {
			padding: 1.5rem 1rem;
		}

		.carousel-item {
			width: 80px;
			height: 60px;
			margin-right: 0.75rem;
		}

		.testimonial-quote {
			font-size: 1.2rem;
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
