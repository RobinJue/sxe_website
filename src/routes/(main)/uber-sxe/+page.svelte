<script lang="ts">
	import { Linkedin, BookOpen, Target, Info } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();

	let language = $state<"de" | "en">("de");
	let flipped = $state<Record<string, boolean>>({});

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

	function toggleFlip(memberId: string) {
		flipped[memberId] = !flipped[memberId];
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
</script>

<svelte:head>
	<title>{t(landing.about.kicker)}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Hero Statement -->
<section class="panel hero-statement reveal" aria-labelledby="hero-statement-title">
	<p class="kicker"><Info size={14} strokeWidth={2.2} /> {t(landing.about.kicker)}</p>
	<h1 id="hero-statement-title" class="statement-text">{t(landing.about.heroStatement)}</h1>
</section>

<!-- Story Section -->
<section class="panel content-section story-section reveal" aria-labelledby="story-title">
	<div class="section-content">
		<div class="section-icon" aria-hidden="true">
			<BookOpen strokeWidth={1.5} />
		</div>
		<div class="section-body">
			<div class="section-header">
				<h2 id="story-title" class="section-title">{language === "de" ? "Die Geschichte" : "The story"}</h2>
			</div>
			<p class="story-text">{t(landing.about.story)}</p>
		</div>
	</div>
</section>

<!-- Mission Section -->
<section class="panel content-section mission-section reveal" aria-labelledby="mission-title">
	<div class="section-content">
		<div class="section-icon" aria-hidden="true">
			<Target strokeWidth={1.5} />
		</div>
		<div class="section-body">
			<div class="section-header">
				<h2 id="mission-title" class="section-title">{language === "de" ? "Was uns antreibt" : "What drives us"}</h2>
			</div>
			<p class="mission-text">{t(landing.about.mission)}</p>
		</div>
	</div>
</section>

<!-- Team Section -->
<section class="panel team-section reveal" aria-labelledby="team-title">
	<div class="section-header">
		<h2 id="team-title" class="section-title">{t(landing.team.title)}</h2>
		<p class="team-label">{t(landing.about.teamLabel)}</p>
	</div>
	<div class="team-grid">
		{#each landing.team.members as member (member.id)}
			<div class="team-card-wrapper">
				<div class={`team-card ${flipped[member.id] ? 'flipped' : ''}`}>
					<!-- Front side -->
					<div class="card-front" onclick={() => toggleFlip(member.id)}>
						<div class="card-image">
							{#if member.photo}
								<img src={member.photo} alt={member.name} decoding="async" loading="lazy" />
							{:else}
								<div class="photo-placeholder">
									{member.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</div>
							{/if}
							<div class="card-overlay">
								<h3 class="member-name">{member.name}</h3>
							</div>
						</div>
						<button class="member-about-button" onclick={(e) => { e.stopPropagation(); toggleFlip(member.id); }}>
							→ {language === "de" ? "ÜBER" : "ABOUT"}
						</button>
					</div>

					<!-- Back side -->
					<div class="card-back" onclick={() => toggleFlip(member.id)}>
						<div class="back-content">
							{#if member.motivation}
								<p class="motivation-text">{t(member.motivation)}</p>
							{/if}
							<a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" class="linkedin-link" onclick={(e) => e.stopPropagation()}>
								<Linkedin size={24} />
							</a>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
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

	/* Panel blocks */
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

	/* Kicker */
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

	/* Hero Statement */
	.hero-statement {
		width: 100%;
		padding: clamp(2rem, 5vw, 3.5rem) clamp(1.1rem, 3vw, 2rem);
		text-align: left;
		display: grid;
		gap: clamp(1rem, 3vw, 2rem);
	}

	.statement-text {
		max-width: 20ch;
		font-size: clamp(2rem, 5.8vw, 4.3rem);
		line-height: 1;
		letter-spacing: 0;
		margin: 0;
	}

	.statement-text::after {
		content: "";
		display: block;
		width: 3.5rem;
		height: 4px;
		background: rgb(255 205 130);
		border-radius: 2px;
		margin-top: 1.5rem;
	}

	/* Content Sections */
	.content-section {
		width: 100%;
		padding: clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2rem);
	}

	.section-content {
		display: flex;
		gap: clamp(1.5rem, 3vw, 2.5rem);
		align-items: center;
	}

	.section-icon {
		flex-shrink: 0;
		color: rgb(255 205 130);
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(4rem, 8vw, 6rem);
		height: clamp(4rem, 8vw, 6rem);
	}

	.section-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.section-body {
		flex: 1;
		min-width: 0;
	}

	.section-header {
		display: grid;
		gap: 0.75rem;
		margin-bottom: clamp(1rem, 3vw, 1.5rem);
	}

	.section-title {
		font-size: clamp(1.5rem, 3vw, 2rem);
		line-height: 1.1;
	}

	.story-text,
	.mission-text {
		font-size: clamp(0.95rem, 1.2vw, 1.1rem);
		line-height: 1.8;
		color: rgb(var(--rgb-text-bright-dark));
	}

	.team-label {
		color: var(--copy-muted);
		font-size: clamp(0.85rem, 1vw, 0.95rem);
		line-height: 1.6;
		margin: 0;
	}

	/* Team Section */
	.team-section {
		width: 100%;
		padding: clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2rem);
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.team-card-wrapper {
		perspective: 1000px;
		aspect-ratio: 1 / 1.15;
		min-height: 100%;
	}

	.team-card {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.6s ease;
		transform-style: preserve-3d;
		cursor: pointer;
		display: flex;
		flex-direction: column;
	}

	.team-card.flipped {
		transform: rotateY(180deg);
	}

	.card-front,
	.card-back {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.card-front {
		transform: rotateY(0deg);
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		z-index: 2;
	}

	.card-back {
		transform: rotateY(180deg);
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, rgb(var(--rgb-white) / 0.09), rgb(var(--rgb-white) / 0.035));
		border: 1px solid var(--line-soft);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.back-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.2rem;
		text-align: center;
		height: 100%;
		justify-content: space-between;
	}

	.motivation-text {
		font-size: 0.85rem;
		line-height: 1.6;
		color: rgb(var(--rgb-text-bright-dark));
		font-family: "Manrope", sans-serif;
	}

	.linkedin-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: rgb(var(--rgb-white) / 0.1);
		border: 1px solid var(--line-soft);
		color: rgb(var(--rgb-brand-blue));
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.linkedin-link:hover {
		background: rgb(var(--rgb-brand-blue));
		color: rgb(var(--rgb-white));
		transform: scale(1.1);
	}

	.card-image {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 0.5rem;
		background: rgb(128 128 128 / 0.3);
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.photo-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgb(var(--rgb-white) / 0.1);
		color: var(--copy-muted);
		font-weight: 700;
		font-size: 1.5rem;
	}

	.card-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1rem;
		background: linear-gradient(180deg, transparent, rgb(0 0 0 / 0.7));
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		min-height: 40%;
	}

	.member-name {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		font-size: clamp(0.9rem, 2vw, 1.1rem);
		font-weight: 800;
		color: rgb(var(--rgb-white));
		margin: 0;
		line-height: 1.1;
		letter-spacing: 0.5px;
	}

	.member-about-button {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		color: rgb(var(--rgb-text-bright-dark));
		text-decoration: none;
		letter-spacing: 0.3px;
		transition: color 0.2s ease;
		display: inline-block;
		border: none;
		background: none;
		padding: 0;
		cursor: pointer;
	}

	.member-about-button:hover {
		color: rgb(var(--rgb-brand-blue));
	}

	/* Animations */
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


	/* Light mode */
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

	:global(html:not(.dark)) .story-text,
	:global(html:not(.dark)) .mission-text {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .team-label {
		color: rgb(64 84 114);
	}

	:global(html:not(.dark)) .card-overlay {
		background: linear-gradient(180deg, transparent, rgb(0 0 0 / 0.5));
	}

	:global(html:not(.dark)) .member-name {
		color: rgb(var(--rgb-white));
	}

	:global(html:not(.dark)) .member-about-button {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .member-about-button:hover {
		color: rgb(var(--rgb-brand-blue));
	}

	:global(html:not(.dark)) .card-back {
		background: linear-gradient(135deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
		border-color: rgb(176 112 24 / 0.18);
	}

	:global(html:not(.dark)) .motivation-text {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .linkedin-link {
		background: rgb(var(--rgb-white) / 0.8);
		border-color: rgb(176 112 24 / 0.18);
	}

	:global(html:not(.dark)) .linkedin-link:hover {
		background: rgb(var(--rgb-brand-blue));
	}

	/* Responsive */
	@media (max-width: 1200px) {
		.team-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.team-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}

		.statement-text::after {
			width: 2.5rem;
			height: 3px;
		}
	}

	@media (max-width: 480px) {
		.team-grid {
			grid-template-columns: 1fr;
		}

		.hero-statement {
			padding: clamp(1.5rem, 4vw, 2.5rem) 1rem;
		}

		.content-section {
			padding: clamp(1.5rem, 4vw, 2.5rem) 1rem;
		}

		.team-section {
			padding: clamp(1.5rem, 4vw, 2.5rem) 1rem;
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
