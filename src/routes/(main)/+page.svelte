<script lang="ts">
	import { ArrowRight, Sparkles, Users, Compass, BookOpen, HelpCircle, Headphones } from "lucide-svelte";
	import type { PageData } from "./$types";
	import { lang } from "$lib/language.svelte.ts";

	let { data } = $props<{ data: PageData }>();

	const content = $derived(data.content);
	const landing = $derived(content.landing);
	const latestEpisode = $derived(content.podcastFeed?.episodes?.[0]);

	// Get all partners flattened for carousel
	const allPartners = $derived(
		landing.partners.tiers.flatMap(tier => tier.items)
	);

	const featureIcons = { Compass, Users, BookOpen };

	let newsletterSubmitted = $state(false);

	function handleNewsletterSubmit(e: SubmitEvent) {
		e.preventDefault();
		newsletterSubmitted = true;
		(e.target as HTMLFormElement).reset();
	}
</script>

<svelte:head>
	<title>{lang.current === "de" ? "SxE: Home" : "SxE: Home"}</title>
	<meta name="description" content={lang.t(landing.meta.description)} />
	<meta property="og:title" content={lang.t(landing.meta.title)} />
	<meta property="og:description" content={lang.t(landing.meta.description)} />
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
		<p class="kicker"><Sparkles size={14} strokeWidth={2.2} /> {lang.t(landing.hero.kicker)}</p>
		<h1 id="hero-title">{lang.t(landing.hero.title)}</h1>
	</div>

	<div class="podcast-teaser-wrap">
		<p class="kicker"><Headphones size={14} strokeWidth={2.2} /> {lang.t(landing.podcast.kicker)}</p>
		<a class="podcast-teaser-card" href="/podcast">
			<img
				src={latestEpisode?.image || content.podcastSettings.fallbackCover}
				alt={latestEpisode?.title || lang.t(landing.podcast.title)}
				loading="lazy"
				decoding="async"
			/>
			<div class="podcast-teaser-copy">
				<strong>{latestEpisode?.title || lang.t(landing.podcast.title)}</strong>
				<span class="podcast-teaser-cta">{lang.t(landing.podcast.ctaLabel)} <ArrowRight size={14} /></span>
			</div>
		</a>
	</div>
</section>

<!-- FAQ Teaser -->
<a class="panel faq-teaser reveal" href="/faq">
	<HelpCircle size={22} strokeWidth={2} class="faq-teaser-icon" />
	<span class="faq-teaser-text">{lang.t(landing.faq.title)}</span>
	<span class="faq-teaser-cta">FAQ <ArrowRight size={18} /></span>
</a>

<!-- Who We Are Section -->
<section class="panel section-panel reveal" aria-labelledby="who-we-are-title">
	<div class="section-head">
		<h2 id="who-we-are-title">{lang.current === "de" ? "Wer wir sind ..." : "Who we are ..."}</h2>
		<p class="lead">{lang.t(landing.hero.lead)}</p>
		<a href={landing.hero.primaryHref} class="text-link"
			>{lang.t(landing.hero.primaryLabel)} <ArrowRight size={15} /></a
		>
	</div>
</section>

<!-- What We Offer Section -->
<section
	class="panel section-panel reveal"
	aria-labelledby="offer-title"
>
	<div class="section-head">
		<h2 id="offer-title">{lang.t(landing.about.offerTitle)}</h2>
	</div>
	<div class="card-grid three">
		{#each landing.about.features as feature (lang.t(feature.title))}
			{@const Icon = featureIcons[feature.icon]}
			{#if feature.href}
				<a class="content-card" href={feature.href}>
					<span class="card-icon" aria-hidden="true"><Icon size={28} strokeWidth={1.75} /></span>
					<h3>{lang.t(feature.title)}</h3>
					<p>{lang.t(feature.text)}</p>
				</a>
			{:else}
				<article class="content-card">
					<span class="card-icon" aria-hidden="true"><Icon size={28} strokeWidth={1.75} /></span>
					<h3>{lang.t(feature.title)}</h3>
					<p>{lang.t(feature.text)}</p>
				</article>
			{/if}
		{/each}
	</div>
</section>

<!-- Social Proof Section -->
{#if landing.socialProof}
	<section class="panel social-proof-panel reveal" aria-labelledby="social-proof-label">
		<div class="social-proof-content">
			<p id="social-proof-label" class="proof-statement">{lang.t(landing.socialProof.statement)}</p>
			<a href={landing.socialProof.ctaHref} class="button button-primary"
				>{lang.t(landing.socialProof.ctaLabel)} <ArrowRight size={16} /></a
			>
		</div>
		<form class="newsletter-form" onsubmit={handleNewsletterSubmit}>
			<h3>{lang.t(landing.contact.newsletterTitle)}</h3>
			<p>{lang.t(landing.contact.newsletterLead)}</p>
			<label for="home-newsletter-email">{lang.t(landing.contact.newsletterEmailLabel)}</label>
			<div class="newsletter-row">
				<input
					id="home-newsletter-email"
					name="newsletter-email"
					type="email"
					autocomplete="email"
					placeholder={lang.t(landing.contact.newsletterEmailPlaceholder)}
					required
				/>
				<button type="submit">{lang.t(landing.contact.newsletterSubmitLabel)}</button>
			</div>
			{#if newsletterSubmitted}
				<p class="form-note" role="status">
					{lang.current === "de" ? "Danke, wir haben deine Eintragung vorgemerkt." : "Thanks, we noted your subscription."}
				</p>
			{/if}
		</form>
	</section>
{/if}

<!-- Testimonial Section -->
{#if landing.testimonial}
	<section class="panel testimonial-panel reveal" aria-labelledby="testimonial-quote">
		{#if landing.testimonial.photo}
			<img src={landing.testimonial.photo} alt={landing.testimonial.author} class="testimonial-image" />
		{/if}
		<blockquote class="testimonial-content">
			<p id="testimonial-quote" class="testimonial-quote">"<em>{lang.t(landing.testimonial.quote)}</em>"</p>
			<footer class="testimonial-footer">
				<div class="testimonial-author">
					<strong>{landing.testimonial.author}</strong>
					<span class="testimonial-title">{lang.t(landing.testimonial.title)}</span>
				</div>
				<p class="testimonial-attribution">{lang.t(landing.testimonial.attribution)}</p>
			</footer>
		</blockquote>
	</section>
{/if}

<!-- Partner Carousel Section -->
{#if allPartners.length > 0}
	<section class="panel carousel-panel reveal" aria-labelledby="partners-carousel-title">
		<h2 id="partners-carousel-title" class="carousel-title">
			{lang.current === "de" ? "Unterstützt von & in Zusammenarbeit mit" : "Supported by & in collaboration with"}
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
		grid-template-columns: 1.35fr 1fr;
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: center;
		padding: clamp(2rem, 5vw, 3.5rem) clamp(1.1rem, 3vw, 2rem);
	}

	.hero-copy,
	.section-head {
		display: grid;
		gap: 0.75rem;
	}

	.podcast-teaser-wrap {
		display: grid;
		gap: 0.6rem;
	}

	.podcast-teaser-card {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.85rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		text-decoration: none;
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.podcast-teaser-card:hover {
		transform: translateY(-3px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.podcast-teaser-card img {
		width: 4.2rem;
		height: 4.2rem;
		border-radius: 0.6rem;
		object-fit: cover;
		flex-shrink: 0;
	}

	.podcast-teaser-copy {
		display: grid;
		gap: 0.3rem;
		min-width: 0;
	}

	.podcast-teaser-copy strong {
		color: rgb(var(--rgb-text-bright-dark));
		font-size: 0.92rem;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.podcast-teaser-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		color: rgb(255 205 130);
		font-size: 0.8rem;
		font-weight: 800;
	}

	/* FAQ Teaser */
	.faq-teaser {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.85rem;
		padding: clamp(1.4rem, 3vw, 2rem) clamp(1.1rem, 3vw, 2rem);
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.faq-teaser:hover {
		transform: translateY(-3px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	:global(.faq-teaser-icon) {
		flex-shrink: 0;
		color: rgb(255 205 130);
	}

	.faq-teaser-text {
		flex: 1;
		min-width: 200px;
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-weight: 600;
		font-size: clamp(1.3rem, 3vw, 1.9rem);
		line-height: 1.15;
	}

	.faq-teaser-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 0.9rem;
		border-radius: 999px;
		border: 1px solid rgb(var(--rgb-brand-blue) / 0.55);
		background: rgb(var(--rgb-brand-blue));
		color: rgb(22 22 18);
		font-weight: 800;
		font-size: 0.85rem;
		flex-shrink: 0;
	}

	.text-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		width: fit-content;
		color: rgb(255 205 130);
		font-weight: 800;
		text-decoration: none;
		font-size: 0.95rem;
	}

	.text-link:hover {
		text-decoration: underline;
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

	/* Social Proof Section */
	.social-proof-panel {
		display: grid;
		gap: 1.75rem;
		padding: clamp(2rem, 4vw, 3rem);
	}

	.social-proof-content {
		display: grid;
		gap: 1rem;
		justify-items: center;
		text-align: center;
	}

	.proof-statement {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		max-width: 46ch;
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 600;
		line-height: 1.2;
		color: rgb(var(--rgb-text-bright-dark));
	}

	.newsletter-form {
		display: grid;
		gap: 0.6rem;
		max-width: 34rem;
		margin: 0 auto;
		width: 100%;
		padding: 1.1rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
	}

	.newsletter-form h3 {
		font-size: 1rem;
	}

	.newsletter-form p {
		color: var(--copy-muted);
	}

	.newsletter-form label {
		color: rgb(var(--rgb-text-bright-dark));
		font-size: 0.82rem;
		font-weight: 800;
	}

	.newsletter-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.5rem;
	}

	.newsletter-form input {
		width: 100%;
		border: 1px solid var(--line-soft);
		border-radius: 0.65rem;
		background: rgb(var(--rgb-black) / 0.18);
		color: rgb(var(--rgb-text-bright-dark));
		font: inherit;
		padding: 0.72rem 0.8rem;
	}

	.newsletter-form button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		min-height: 2.75rem;
		padding: 0.7rem 1rem;
		border-radius: 999px;
		border: 1px solid rgb(var(--rgb-brand-blue) / 0.55);
		background: rgb(var(--rgb-brand-blue));
		color: rgb(22 22 18);
		font-weight: 800;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.newsletter-form button:hover {
		transform: translateY(-1px);
	}

	.form-note {
		color: rgb(255 205 130);
		font-size: 0.88rem;
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
		font-size: 0.95rem;
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
		text-decoration: none;
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

	:global(html:not(.dark)) .podcast-teaser-card,
	:global(html:not(.dark)) .newsletter-form {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
	}

	:global(html:not(.dark)) .podcast-teaser-copy strong {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .newsletter-form input {
		border-color: rgb(var(--rgb-slate-900) / 0.18);
		background: rgb(var(--rgb-white) / 0.88);
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .content-card {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
	}

	:global(html:not(.dark)) .proof-statement,
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

		.faq-teaser {
			padding: 1.1rem;
		}

		.newsletter-row {
			grid-template-columns: 1fr;
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
