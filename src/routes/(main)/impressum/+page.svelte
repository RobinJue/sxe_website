<script lang="ts">
	import { ShieldCheck, Linkedin } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();
	const content = $derived(data.content);
</script>

<svelte:head>
	<title>{content.pageTitle} | {content.brandName}</title>
</svelte:head>

<section class="panel section-panel reveal" aria-labelledby="legal-title">
	<div class="section-head">
		<p class="kicker"><ShieldCheck size={14} strokeWidth={2.2} /> {content.pageKicker}</p>
		<h2 id="legal-title">{content.pageTitle}</h2>
		<p class="lead">{content.pageLead}</p>
	</div>

	<div class="legal-list">
		<article class="legal-item" id="impressum">
			<h3>{content.impressumTitle}</h3>
			<div class="legal-html">{@html content.impressumHtml}</div>
			<p class="website-credit">
				{content.websiteCreditLabel}
				{#each content.websiteCredits as credit, index (credit.name)}
					{#if index > 0},{/if}
					{credit.name}
					<a
						href={credit.linkedinUrl}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${credit.name} auf LinkedIn`}
					>
						<Linkedin size={16} />
					</a>
				{/each}
			</p>
		</article>

		<article class="legal-item" id="datenschutz">
			<h3>{content.datenschutzTitle}</h3>
			<div class="legal-html">{@html content.datenschutzHtml}</div>
		</article>
	</div>

	<p class="notice">{content.noticeText}</p>
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
		padding: clamp(1.15rem, 4vw, 3rem);
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
		font-size: var(--font-size-kicker);
		font-weight: 800;
		letter-spacing: 0.08em;
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
		font-weight: 600;
		letter-spacing: 0;
	}

	h2 {
		max-width: 26ch;
		font-size: var(--font-size-h1);
		line-height: 1;
	}

	h3 {
		font-size: 1.15rem;
	}

	.lead {
		color: var(--copy-muted);
		font-size: var(--font-size-lead);
	}

	.legal-list {
		display: grid;
		gap: 1rem;
	}

	.legal-item {
		display: grid;
		gap: 0.6rem;
		padding: 1.1rem 1.15rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.legal-item:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.legal-html {
		display: grid;
		gap: 0.55rem;
	}

	.legal-html :global(p),
	.legal-html :global(li) {
		margin: 0;
		color: rgb(var(--rgb-legal-copy-dark));
		line-height: 1.6;
	}

	.legal-html :global(ul) {
		margin: 0;
		padding-left: 1.2rem;
		display: grid;
		gap: 0.35rem;
	}

	.legal-html :global(a) {
		color: rgb(var(--rgb-link-dark));
	}

	.website-credit {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: rgb(var(--rgb-legal-copy-dark));
		font-size: var(--font-size-small);
	}

	.website-credit a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 999px;
		border: 1px solid rgb(var(--rgb-white) / 0.2);
		background: rgb(var(--rgb-white) / 0.06);
		color: rgb(var(--rgb-link-dark));
	}

	.website-credit a:hover {
		background: rgb(var(--rgb-white) / 0.14);
	}

	.notice {
		color: var(--copy-muted);
		font-size: var(--font-size-small);
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

	:global(html:not(.dark)) .legal-item {
		border-color: rgb(var(--rgb-slate-900) / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
	}

	:global(html:not(.dark)) .legal-html :global(p),
	:global(html:not(.dark)) .legal-html :global(li),
	:global(html:not(.dark)) .website-credit {
		color: rgb(64 84 114);
	}

	:global(html:not(.dark)) .legal-html :global(a) {
		color: rgb(29 58 97);
	}

	:global(html:not(.dark)) .website-credit a {
		border-color: rgb(var(--rgb-slate-900) / 0.18);
		background: rgb(var(--rgb-slate-800) / 0.08);
		color: rgb(var(--rgb-link-light));
	}

	:global(html:not(.dark)) .website-credit a:hover {
		background: rgb(var(--rgb-slate-800) / 0.14);
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
		}
	}
</style>
