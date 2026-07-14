<script lang="ts">
	import { Linkedin, BookOpen, Target, Info, ArrowRight } from "lucide-svelte";
	import type { PageData } from "./$types";
	import { lang } from "$lib/language.svelte.ts";

	let { data } = $props<{ data: PageData }>();

	let flipped = $state<Record<string, boolean>>({});

	function flipCard(memberId: string) {
		flipped[memberId] = true;
	}

	function unflipCard(memberId: string) {
		flipped[memberId] = false;
	}

	const content = $derived(data.content);
	const landing = $derived(content.landing);

	// Build the mailto link only when clicked, so the raw address never sits
	// in the server-rendered HTML for bots to scrape.
	function openJoinMail(e: MouseEvent) {
		e.preventDefault();
		const user = "sxe.science";
		const domain = "gmail.com";
		window.location.href = `mailto:${user}@${domain}?subject=Bei%20SxE%20einbringen`;
	}
</script>

<svelte:head>
	<title>{lang.current === "de" ? "SxE: Über" : "SxE: About"}</title>
</svelte:head>

<!-- Hero Statement -->
<section class="panel hero-statement reveal" aria-labelledby="hero-statement-title">
	<p class="kicker"><Info size={14} strokeWidth={2.2} /> {lang.t(landing.about.kicker)}</p>
	<h1 id="hero-statement-title" class="statement-text">{lang.t(landing.about.heroStatement)}</h1>
	{#if landing.about.lead}
		<p class="lead">{lang.t(landing.about.lead)}</p>
	{/if}
</section>

<!-- Join CTA -->
{#if landing.about.primaryLabel}
	<section class="panel join-cta reveal" aria-labelledby="join-cta-title">
		<p id="join-cta-title" class="join-cta-text">
			{lang.current === "de"
				? "Bist du Stipendiat der Studienstiftung? Werde Teil von SxE!"
				: "Are you a Studienstiftung scholar? Join SxE!"}
		</p>
		<a href="#" class="button button-primary" onclick={openJoinMail}
			>{lang.t(landing.about.primaryLabel)} <ArrowRight size={16} /></a
		>
	</section>
{/if}

<!-- Story Section -->
<section class="panel content-section story-section reveal" aria-labelledby="story-title">
	<div class="section-content">
		<div class="section-icon" aria-hidden="true">
			<BookOpen strokeWidth={1.5} />
		</div>
		<div class="section-body">
			<div class="section-header">
				<h2 id="story-title" class="section-title">{lang.current === "de" ? "Die Geschichte" : "The story"}</h2>
			</div>
			<p class="story-text">{lang.t(landing.about.story)}</p>
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
				<h2 id="mission-title" class="section-title">{lang.current === "de" ? "Was uns antreibt" : "What drives us"}</h2>
			</div>
			<p class="mission-text">{lang.t(landing.about.mission)}</p>
		</div>
	</div>
</section>

<!-- Team Section -->
<section class="panel team-section reveal" aria-labelledby="team-title">
	<div class="section-header">
		<h2 id="team-title" class="section-title">{lang.t(landing.team.title)}</h2>
		<p class="team-label">{lang.t(landing.about.teamLabel)}</p>
	</div>
	<div class="team-grid">
		{#each landing.team.members as member (member.id)}
			<div
				class="team-card-wrapper"
				onmouseenter={() => flipCard(member.id)}
				onmouseleave={() => unflipCard(member.id)}
			>
				<div class={`team-card ${flipped[member.id] ? 'flipped' : ''}`}>
					<!-- Front side -->
					<div class="card-front" onclick={() => flipCard(member.id)}>
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
					</div>

					<!-- Back side -->
					<div class="card-back" onclick={() => unflipCard(member.id)}>
						<a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" class="linkedin-link" onclick={(e) => e.stopPropagation()}>
							<Linkedin size={56} strokeWidth={1.5} />
						</a>
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
		font-weight: 600;
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
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.panel:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
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
		font-size: var(--font-size-kicker);
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
		gap: 0.75rem;
	}

	.statement-text {
		max-width: 21ch;
		font-size: var(--font-size-h1);
		line-height: 1;
		letter-spacing: 0;
		margin: 0;
		white-space: pre-line;
	}

	.lead {
		color: var(--copy-muted);
		max-width: 66ch;
		font-size: var(--font-size-lead);
	}

	/* Join CTA */
	.join-cta {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: clamp(1.5rem, 4vw, 2.25rem) clamp(1.25rem, 4vw, 2rem);
	}

	.join-cta-text {
		flex: 1;
		min-width: 220px;
		margin: 0;
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-weight: 600;
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		line-height: 1.25;
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

	.linkedin-link {
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgb(18 37 63);
		transition: transform 0.2s ease;
		text-decoration: none;
	}

	.linkedin-link:hover {
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
	}

	:global(html:not(.dark)) h1,
	:global(html:not(.dark)) h2,
	:global(html:not(.dark)) h3,
	:global(html:not(.dark)) .join-cta-text {
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

	:global(html:not(.dark)) .card-back {
		background: linear-gradient(135deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
		border-color: rgb(var(--rgb-slate-900) / 0.18);
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
