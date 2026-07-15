<script lang="ts">
	import { ArrowRight, ExternalLink, Search, Headphones } from "lucide-svelte";
	import { onMount } from "svelte";
	import type { LocalizedString, PodcastEpisode } from "$lib/cms/types";
	import type { PageData } from "./$types";
	import { lang } from "$lib/language.svelte.ts";

	type ThemeMode = "dark" | "light";

	let { data } = $props<{ data: PageData }>();

	let themeMode = $state<ThemeMode>("light");
	let searchQuery = $state("");
	let newsletterStatus = $state<"idle" | "sending" | "sent" | "error">("idle");
	let comingSoonFor = $state<string | null>(null);
	let comingSoonTimeout: ReturnType<typeof setTimeout> | undefined;

	const content = $derived(data.content);
	const landing = $derived(content.landing);
	const podcast = $derived(content.podcastSettings);
	const feed = $derived(content.podcastFeed);
	// Nick Turley stays the featured/highlight episode even though he isn't
	// numerically the latest; the full list below still shows every real
	// episode in order (including him), just not unfinished placeholders.
	const HIGHLIGHT_EPISODE_ID = "ep-02-nick-turley";
	const latestEpisode = $derived(
		feed.episodes.find(episode => episode.id === HIGHLIGHT_EPISODE_ID) ?? feed.episodes[0]
	);
	const recentEpisodes = $derived(feed.episodes.filter(episode => !episode.id.includes("coming-soon")));
	const filteredEpisodes = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();
		const episodes = recentEpisodes;
		if (!query) {
			return episodes;
		}

		return episodes.filter((episode: PodcastEpisode) =>
			`${episode.title} ${episode.description}`.toLowerCase().includes(query)
		);
	});

	onMount(() => {
		themeMode = getCurrentThemeMode();
	});

	function getCurrentThemeMode(): ThemeMode {
		if (typeof document === "undefined") {
			return "light";
		}
		return document.documentElement.classList.contains("dark") ? "dark" : "light";
	}

	function formatEpisodeDate(value: string): string {
		const parsed = Date.parse(value);
		if (!Number.isFinite(parsed)) {
			return "";
		}

		return new Date(parsed).toLocaleDateString(lang.current === "de" ? "de-DE" : "en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		});
	}

	function episodeUrl(episode: PodcastEpisode): string {
		return episode.url || episode.audioUrl || "#";
	}

	function feedStatusMessage(): string {
		if (feed.status === "missing-url") {
			return lang.t(podcast.missingFeedMessage);
		}
		if (feed.status === "error") {
			return lang.t(podcast.feedErrorMessage);
		}
		if (feed.status === "empty") {
			return lang.t(podcast.emptyFeedMessage);
		}
		return "";
	}

	async function handleNewsletterSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		newsletterStatus = "sending";

		try {
			const res = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				body: new FormData(form)
			});
			newsletterStatus = res.ok ? "sent" : "error";
		} catch {
			newsletterStatus = "error";
		}

		if (newsletterStatus === "sent") {
			form.reset();
		}
	}

	function showComingSoon(label: string) {
		comingSoonFor = label;
		clearTimeout(comingSoonTimeout);
		comingSoonTimeout = setTimeout(() => {
			comingSoonFor = null;
		}, 2500);
	}
</script>

<svelte:head>
	<title>{lang.current === "de" ? "SxE: Podcast" : "SxE: Podcast"}</title>
	<meta name="description" content={lang.t(podcast.metaDescription)} />
	<meta property="og:title" content={lang.t(podcast.metaTitle)} />
	<meta property="og:description" content={lang.t(podcast.metaDescription)} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={podcast.fallbackCover} />
</svelte:head>

<main class="podcast-main">
		<section class="panel hero-panel">
			<div class="hero-copy">
				<p class="kicker"><Headphones size={14} strokeWidth={2.2} /> {lang.t(podcast.kicker)}</p>
				<h1>{lang.t(podcast.title)}</h1>
				<p class="lead">{lang.t(podcast.intro)}</p>
				<div class="hero-actions" aria-label={lang.t(podcast.listenLabel)}>
					{#each podcast.platformLinks as link (link.label)}
						{#if link.available}
							<a href={link.url} target="_blank" rel="noopener noreferrer" class="button button-primary">
								{link.label}
								<ExternalLink size={16} />
							</a>
						{:else}
							<button type="button" class="button button-primary" onclick={() => showComingSoon(link.label)}>
								{link.label}
								<ExternalLink size={16} />
							</button>
						{/if}
					{/each}
				</div>
				<p class="coming-soon-note" role="status" aria-live="polite">
					{#if comingSoonFor}
						{comingSoonFor} {lang.current === "de" ? "– bald verfügbar" : "– coming soon"}
					{/if}
				</p>
			</div>
		</section>

		<section class="newsletter-panel">
			<div>
				<p class="kicker">Newsletter</p>
				<h2>{lang.t(podcast.newsletterTitle)}</h2>
				<p>{lang.t(podcast.newsletterLead)}</p>
			</div>
			<form onsubmit={handleNewsletterSubmit}>
				<label for="podcast-newsletter-email">{lang.t(podcast.newsletterEmailLabel)}</label>
				<div class="newsletter-row">
					<input
						id="podcast-newsletter-email"
						name="email"
						type="email"
						required
						placeholder={lang.t(podcast.newsletterEmailPlaceholder)}
					/>
					<button type="submit" disabled={newsletterStatus === "sending"}>
						{lang.t(podcast.newsletterSubmitLabel)}
					</button>
				</div>
				<input type="hidden" name="source" value="podcast" />
				<input class="hp-field" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true" />
				<p class="form-hint">
					{lang.current === "de"
						? "Wir schicken dir eine Bestätigungs-E-Mail. Du kannst dich jederzeit mit einem Klick abmelden und deine Daten löschen lassen."
						: "We'll send you a confirmation email. You can unsubscribe and delete your data with one click at any time."}
				</p>
				{#if newsletterStatus === "sent"}
					<p class="form-note" role="status">
						{lang.current === "de"
							? "Fast geschafft — bitte bestätige deine Anmeldung über den Link in der E-Mail, die wir dir geschickt haben."
							: "Almost there — please confirm your subscription via the link we just emailed you."}
					</p>
				{:else if newsletterStatus === "error"}
					<p class="form-note error" role="status">
						{lang.current === "de"
							? "Etwas ist schiefgelaufen. Bitte versuche es erneut."
							: "Something went wrong. Please try again."}
					</p>
				{/if}
			</form>
		</section>

		{#if feed.status !== "ok"}
			<section class="status-panel" role="status">
				<h2>{lang.current === "de" ? "RSS-Status" : "RSS status"}</h2>
				<p>{feedStatusMessage()}</p>
				{#if feed.errorMessage}
					<code>{feed.errorMessage}</code>
				{/if}
			</section>
		{/if}

		{#if latestEpisode}
			<section class="latest-panel" aria-labelledby="latest-episode-title">
				<div>
					<p class="kicker">{lang.t(podcast.latestLabel)}</p>
					<h2 id="latest-episode-title">{latestEpisode.title}</h2>
					<p>{latestEpisode.description}</p>
					<div class="episode-meta">
						{#if formatEpisodeDate(latestEpisode.date)}
							<span>{formatEpisodeDate(latestEpisode.date)}</span>
						{/if}
						{#if latestEpisode.duration}
							<span>{latestEpisode.duration}</span>
						{/if}
					</div>
					<a class="button-primary" href={episodeUrl(latestEpisode)} target="_blank" rel="noopener noreferrer">
						{lang.t(podcast.episodeCtaLabel)}
						<ArrowRight size={15} />
					</a>
				</div>
				<img src={latestEpisode.image || podcast.fallbackCover} alt={latestEpisode.title} loading="lazy" />
			</section>
		{/if}

		<section class="episodes-panel" aria-labelledby="recent-episodes-title">
			<div class="section-head">
				<div>
					<p class="kicker">{lang.t(podcast.recentLabel)}</p>
					<h2 id="recent-episodes-title">{lang.t(podcast.recentLabel)}</h2>
				</div>
				<label class="search-box">
					<span>{lang.t(podcast.searchLabel)}</span>
					<div>
						<Search size={15} />
						<input bind:value={searchQuery} placeholder={lang.t(podcast.searchPlaceholder)} />
					</div>
				</label>
			</div>

			{#if filteredEpisodes.length > 0}
				<div class="episode-grid">
					{#each filteredEpisodes as episode (episode.id)}
						<article class="episode-card">
							<img src={episode.image || podcast.fallbackCover} alt={episode.title} loading="lazy" />
							<div>
								<p class="episode-date">{formatEpisodeDate(episode.date)}</p>
								<h3>{episode.title}</h3>
								<p>{episode.description}</p>
								<a href={episodeUrl(episode)} target="_blank" rel="noopener noreferrer">
									{lang.t(podcast.episodeCtaLabel)}
									<ExternalLink size={13} />
								</a>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<p class="empty-state">{searchQuery ? lang.t(podcast.noResultsMessage) : feedStatusMessage()}</p>
			{/if}
		</section>
	</main>

<style>
	:global(body) {
		margin: 0;
		font-family: "Manrope", system-ui, sans-serif;
		background: var(--background);
	}

	.podcast-main {
		position: relative;
		z-index: 1;
		width: 100%;
	}

	.platform-list a,
	.episode-card a {
		color: inherit;
		text-decoration: none;
	}

	.podcast-main {
		display: grid;
		gap: 1rem;
		padding: 0.5rem 0 2rem;
	}

	.hero-panel {
		width: 100%;
		border: 1px solid var(--line-soft);
		border-radius: 0.9rem;
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.09), rgb(var(--rgb-white) / 0.035)),
			var(--shell-1);
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
		display: grid;
		align-items: center;
		padding: clamp(2rem, 5vw, 3.5rem) clamp(1.1rem, 3vw, 2rem);
	}

	.latest-panel,
	.episodes-panel,
	.newsletter-panel,
	.status-panel {
		border: 1px solid var(--line-soft);
		border-radius: 0.95rem;
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.09), rgb(var(--rgb-white) / 0.035)),
			var(--shell-1);
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.hero-panel:hover,
	.latest-panel:hover,
	.episodes-panel:hover,
	.newsletter-panel:hover,
	.status-panel:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.latest-panel,
	.newsletter-panel {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(15rem, 0.75fr);
		gap: 1.2rem;
		align-items: center;
		padding: clamp(1rem, 3vw, 1.6rem);
	}

	.hero-copy {
		display: grid;
		gap: 0.75rem;
	}

	.hero-panel h1 {
		max-width: 6ch;
		font-size: var(--font-size-h1);
		line-height: 1;
	}

	.hero-panel .lead {
		color: var(--copy-muted);
		max-width: 66ch;
		font-size: var(--font-size-lead);
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
		border: 0;
		font: inherit;
		font-weight: 800;
		text-decoration: none;
		cursor: pointer;
		appearance: none;
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

	.coming-soon-note {
		min-height: 1.2rem;
		margin: 0.35rem 0 0;
		color: rgb(255 205 130);
		font-size: var(--font-size-small);
		font-weight: 700;
	}

	.kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.42rem;
		width: fit-content;
		margin: 0;
		color: rgb(255 205 130);
		font-size: var(--font-size-kicker);
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.episode-date {
		margin: 0;
		color: rgb(255 205 130);
		font-size: var(--font-size-tiny);
		font-weight: 900;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	h1,
	h2,
	h3 {
		margin: 0;
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.08;
	}

	h1 {
		max-width: 20ch;
		font-size: var(--font-size-h1);
		line-height: 1;
	}

	h2 {
		font-size: clamp(1.45rem, 4vw, 2.35rem);
	}

	h3 {
		font-size: var(--font-size-h3);
	}

	p {
		margin: 0;
		color: rgb(197 211 234);
		line-height: 1.6;
	}

	.hero-cover,
	.latest-panel img,
	.episode-card img {
		display: block;
		width: 100%;
		border-radius: 0.75rem;
		background: rgb(var(--rgb-white) / 0.92);
		object-fit: cover;
	}

	.hero-cover,
	.latest-panel img {
		aspect-ratio: 1;
	}

	.episode-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.button-primary:not(.button),
	.episode-card a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		width: fit-content;
		min-height: 2.25rem;
		border-radius: 999px;
		font-weight: 900;
	}

	.platform-list a,
	.episode-card a {
		padding: 0 0.75rem;
		border: 1px solid rgb(var(--rgb-white) / 0.14);
		background: rgb(var(--rgb-white) / 0.07);
		color: rgb(255 205 130);
	}

	.button-primary:not(.button) {
		margin-top: 0.4rem;
		padding: 0 0.9rem;
		background: rgb(var(--rgb-brand-blue));
		color: rgb(16 32 58);
		text-decoration: none;
	}

	.latest-panel > div,
	.newsletter-panel > div,
	.status-panel {
		display: grid;
		gap: 0.75rem;
	}

	.episode-meta span {
		color: rgb(151 173 211);
		font-size: var(--font-size-caption);
		font-weight: 800;
	}

	.status-panel,
	.episodes-panel {
		padding: clamp(1rem, 3vw, 1.35rem);
	}

	.status-panel code {
		overflow-wrap: anywhere;
		color: rgb(255 205 130);
	}

	.section-head {
		display: flex;
		gap: 1rem;
		align-items: end;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.search-box {
		display: grid;
		gap: 0.35rem;
		min-width: min(100%, 22rem);
		color: rgb(197 211 234);
		font-size: var(--font-size-caption);
		font-weight: 800;
	}

	.search-box div,
	.newsletter-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.45rem;
		align-items: center;
	}

	.search-box div {
		height: 2.5rem;
		padding: 0 0.75rem;
		border: 1px solid rgb(var(--rgb-white) / 0.14);
		border-radius: 999px;
		background: rgb(var(--rgb-black) / 0.18);
	}

	input {
		min-width: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		outline: none;
	}

	.episode-grid {
		display: grid;
		gap: 0.8rem;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	}

	.episode-card {
		display: grid;
		grid-template-columns: 6rem minmax(0, 1fr);
		gap: 0.75rem;
		padding: 0.85rem;
		border: 1px solid var(--line-soft);
		border-radius: 0.8rem;
		background: rgb(var(--rgb-white) / 0.06);
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.episode-card:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.episode-card img {
		aspect-ratio: 1;
	}

	.episode-card div {
		display: grid;
		gap: 0.4rem;
		min-width: 0;
	}

	.episode-card p:not(.episode-date) {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
	}

	.empty-state,
	.form-note {
		color: rgb(255 205 130);
		font-weight: 800;
	}

	.newsletter-panel form {
		display: grid;
		gap: 0.55rem;
	}

	.newsletter-panel label {
		color: rgb(237 244 255);
		font-weight: 800;
	}

	.newsletter-row {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.newsletter-row input {
		height: 2.5rem;
		padding: 0 0.8rem;
		border: 1px solid rgb(var(--rgb-white) / 0.14);
		border-radius: 0.65rem;
		background: rgb(var(--rgb-black) / 0.18);
	}

	.newsletter-row button {
		height: 2.5rem;
		border: 0;
		border-radius: 0.65rem;
		padding: 0 0.85rem;
		background: rgb(var(--rgb-brand-blue));
		color: rgb(16 32 58);
		font-weight: 900;
		cursor: pointer;
	}

	.newsletter-row button:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.form-note.error {
		color: rgb(240 130 120);
	}

	.form-hint {
		color: rgb(181 192 214);
		font-size: var(--font-size-tiny);
		font-weight: 400;
	}

	.hp-field {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(html:not(.dark)) .ambient {
		background:
			radial-gradient(circle at 10% 8%, rgb(88 105 128 / 0.08), transparent 30%),
			radial-gradient(circle at 86% 14%, rgb(88 105 128 / 0.06), transparent 34%);
	}

	:global(html:not(.dark)) p,
	:global(html:not(.dark)) .search-box,
	:global(html:not(.dark)) .newsletter-panel label {
		color: rgb(64 84 114);
	}

	:global(html:not(.dark)) .hero-panel,
	:global(html:not(.dark)) .latest-panel,
	:global(html:not(.dark)) .episodes-panel,
	:global(html:not(.dark)) .newsletter-panel,
	:global(html:not(.dark)) .status-panel {
		border-color: rgb(var(--rgb-slate-900) / 0.18);
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5)),
			rgb(var(--rgb-white));
	}

	:global(html:not(.dark)) h1,
	:global(html:not(.dark)) h2,
	:global(html:not(.dark)) h3 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .kicker {
		color: rgb(255 205 130);
	}

	:global(html:not(.dark)) .button-primary {
		border: 1px solid rgb(var(--rgb-brand-blue) / 0.55);
		background: rgb(var(--rgb-brand-blue));
		color: rgb(22 22 18);
	}

	:global(html:not(.dark)) .episode-card a,
	:global(html:not(.dark)) .search-box div,
	:global(html:not(.dark)) .newsletter-row input {
		border-color: rgb(var(--rgb-slate-900) / 0.22);
		background: rgb(var(--rgb-white) / 0.7);
		color: rgb(111 70 17);
	}

	:global(html:not(.dark)) .episode-card {
		border-color: rgb(var(--rgb-slate-900) / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
	}

	@media (max-width: 820px) {
		.hero-panel,
		.latest-panel,
		.newsletter-panel {
			grid-template-columns: 1fr;
		}

		.section-head {
			align-items: stretch;
			flex-direction: column;
		}
	}

	@media (max-width: 560px) {
		.episode-card {
			grid-template-columns: 1fr;
		}

		.newsletter-row {
			grid-template-columns: 1fr;
		}
	}
</style>
