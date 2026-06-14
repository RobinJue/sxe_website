<script lang="ts">
	import { BookOpen, Linkedin } from "lucide-svelte";
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
</script>

<svelte:head>
	<title>{t(landing.infographics.title)}</title>
</svelte:head>

<section class="panel section-panel reveal" aria-labelledby="infographics-title">
	<div class="section-head">
		<p class="kicker"><BookOpen size={14} strokeWidth={2.2} /> {t(landing.infographics.kicker)}</p>
		<h2 id="infographics-title">{t(landing.infographics.title)}</h2>
	</div>
	<div class="infographic-grid">
		{#each landing.infographics.items as item (item.src)}
			<article class="infographic-card">
				<div class="infographic-copy">
					<h3>{t(item.title)}</h3>
					<p>{t(item.teaser)}</p>
					<p class="meta">{item.credit}</p>
				</div>
				<div class="infographic-media">
					{#if item.variant === "career"}
						<div class="infographic-core career-core" role="img" aria-label={t(item.alt)}>
							{#each [{key: "startup", icon: "🚀", title: { de: "Gründung", en: "Startup" }, subtitle: { de: "", en: "" }, pros: [{de: "Eigene Ideen in die Realität umsetzen.", en: "Turn your own ideas into reality."}, {de: "Sichtbare Wirkung in Gesellschaft oder Industrie erzeugen.", en: "Create visible impact in society or industry."}, {de: "Viel Autonomie und kreative Freiheit.", en: "High autonomy and creative freedom."}, {de: "Steile Lernkurve in Strategie, Führung und Teamarbeit.", en: "Steep learning curve in strategy, leadership and teamwork."}], cons: [{de: "Hohe Unsicherheit und persönliche Verantwortung.", en: "High uncertainty and personal responsibility."}, {de: "Finanzielle Sicherheit kann am Anfang begrenzt sein.", en: "Financial security can be limited early on."}, {de: "Rückschläge und Anpassung gehören zum Weg.", en: "Setbacks and adaptation are part of the path."}, {de: "Erfolg hängt auch von Timing, Team und Umsetzung ab.", en: "Success also depends on timing, team and execution."}]}, {key: "academia", icon: "🎓", title: { de: "Akademische Karriere", en: "Academic career" }, subtitle: { de: "", en: "" }, pros: [{de: "Faszinierende Fragen in echter Tiefe erkunden.", en: "Explore fascinating questions in real depth."}, {de: "Zu wissenschaftlichem Fortschritt beitragen.", en: "Contribute to scientific progress."}, {de: "Fundierte Expertise in einem Feld aufbauen.", en: "Build deep expertise in one field."}, {de: "Inspirierendes Umfeld für Lernen und Mentoring.", en: "Inspiring environment for learning and mentoring."}], cons: [{de: "Karrierewege können lang und stark umkämpft sein.", en: "Career paths can be long and highly competitive."}, {de: "Feste Stellen sind in vielen Bereichen begrenzt.", en: "Permanent positions are limited in many fields."}, {de: "Der Weg zur Anwendung kann Zeit brauchen.", en: "The path to application can take time."}, {de: "Systeme und Förderung können Flexibilität einschränken.", en: "Systems and funding can limit flexibility."}]}] as column (column.key)}
								<section class="career-column">
									<div class="diagram-head">
										<span class="diagram-badge" aria-hidden="true">{column.icon}</span>
										<div>
											<h4>{t(column.title)}</h4>
											{#if t(column.subtitle)}
												<p>{t(column.subtitle)}</p>
											{/if}
										</div>
									</div>
									<div class="comparison-lists">
										<div>
											<strong>{language === "de" ? "Vorteile" : "Advantages"}</strong>
											<ul>
												{#each column.pros as point}
													<li>{t(point)}</li>
												{/each}
											</ul>
										</div>
										<div>
											<strong>{language === "de" ? "Nachteile" : "Trade-offs"}</strong>
											<ul class="muted-list">
												{#each column.cons as point}
													<li>{t(point)}</li>
												{/each}
											</ul>
										</div>
									</div>
								</section>
							{/each}
						</div>
					{:else}
						<img src={item.src} alt={t(item.alt)} loading="lazy" decoding="async" />
					{/if}
				</div>
			</article>
		{/each}
	</div>
</section>


	<section class="team-section reveal" aria-labelledby="team-title">
		<div class="section-head">
			<p class="kicker"><BookOpen size={14} strokeWidth={2.2} /> {t(landing.team.kicker)}</p>
			<h2 id="team-title">{t(landing.team.title)}</h2>
		</div>
		<div class="team-grid">
			{#each landing.team.members as member (member.id)}
				<article class="team-card">
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
					<a class="member-about" href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
						→ {language === "de" ? "ÜBER" : "ABOUT"} {member.name.split(" ")[0].toUpperCase()}
					</a>
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
		border-radius: 999px;
		color: rgb(255 205 130);
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h2,
	h3,
	h4,
	p {
		margin: 0;
	}

	h2,
	h3,
	h4 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		letter-spacing: 0;
	}

	h2 {
		font-size: clamp(1.65rem, 3vw, 2.75rem);
		line-height: 1.05;
	}

	h3 {
		font-size: 1.05rem;
		line-height: 1.2;
	}

	h4 {
		font-size: 1rem;
		line-height: 1.2;
	}

	.infographic-grid {
		display: grid;
		gap: 1rem;
	}

	.infographic-card {
		display: grid;
		grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
		gap: 1rem;
		align-items: center;
		padding: 1rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
	}

	.infographic-copy {
		display: grid;
		gap: 0.45rem;
	}

	.infographic-copy p {
		color: var(--copy-muted);
	}

	.meta {
		color: rgb(151 173 211);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.infographic-media {
		container-type: inline-size;
		min-width: 0;
		width: 100%;
	}

	.infographic-card img {
		display: block;
		width: 100%;
		border-radius: 0.65rem;
		background: rgb(var(--rgb-white) / 0.9);
		max-height: 27rem;
		object-fit: contain;
	}

	.infographic-core {
		display: grid;
		gap: 0.7rem;
		min-width: 0;
		width: 100%;
		padding: 0.8rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.65rem;
		background: rgb(var(--rgb-black) / 0.16);
		overflow-wrap: anywhere;
	}

	.career-core {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.career-column {
		display: grid;
		grid-template-rows: auto auto;
		align-content: start;
		gap: 0.7rem;
		padding: 0.75rem;
		min-width: 0;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.6rem;
		background: rgb(var(--rgb-white) / 0.06);
	}

	.diagram-head {
		display: flex;
		gap: 0.65rem;
		align-items: center;
		min-height: 4.35rem;
		padding-bottom: 0.65rem;
		border-bottom: 1px solid rgb(var(--rgb-white) / 0.12);
	}

	.diagram-badge {
		display: grid;
		flex: 0 0 auto;
		width: 2.2rem;
		height: 2.2rem;
		place-items: center;
		border-radius: 0.55rem;
		background: rgb(var(--rgb-brand-blue));
		font-size: 1.05rem;
	}

	.comparison-lists {
		display: grid;
		gap: 0.65rem;
	}

	.comparison-lists strong {
		display: block;
		margin-bottom: 0.35rem;
		color: rgb(255 205 130);
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.comparison-lists ul {
		display: grid;
		gap: 0.38rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.comparison-lists li {
		position: relative;
		padding-left: 0.9rem;
		color: rgb(var(--rgb-text-bright-dark));
		font-size: 0.78rem;
		line-height: 1.38;
	}

	.comparison-lists li::before {
		content: "";
		position: absolute;
		top: 0.48em;
		left: 0;
		width: 0.36rem;
		height: 0.36rem;
		border-radius: 999px;
		background: rgb(var(--rgb-brand-blue));
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

	:global(html:not(.dark)) h2,
	:global(html:not(.dark)) h3,
	:global(html:not(.dark)) h4 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .infographic-card {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.96), rgb(255 238 214 / 0.48));
	}

	:global(html:not(.dark)) .career-column {
		border-color: rgb(var(--rgb-slate-900) / 0.12);
		background: rgb(var(--rgb-white) / 0.68);
	}

	:global(html:not(.dark)) .diagram-head {
		border-bottom-color: rgb(var(--rgb-slate-900) / 0.12);
	}

	@media (max-width: 900px) {
		.infographic-card {
			grid-template-columns: 1fr;
		}

		.career-core {
			grid-template-columns: 1fr;
		}
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
			scroll-behavior: auto !important;
		}
	}

	.team-section {
		width: 100%;
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.team-card {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
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

	.member-about {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		color: rgb(var(--rgb-text-bright-dark));
		text-decoration: none;
		letter-spacing: 0.3px;
		transition: color 0.2s ease;
		display: inline-block;
	}

	.member-about:hover {
		color: rgb(var(--rgb-brand-blue));
	}

	:global(html:not(.dark)) .card-overlay {
		background: linear-gradient(180deg, transparent, rgb(0 0 0 / 0.5));
	}

	:global(html:not(.dark)) .member-about {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .member-about:hover {
		color: rgb(var(--rgb-brand-blue));
	}

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
	}
</style>
