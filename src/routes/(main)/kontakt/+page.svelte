<script lang="ts">
	import { Mail } from "lucide-svelte";
	import type { PageData } from "./$types";
	import { lang } from "$lib/language.svelte.ts";

	let { data } = $props<{ data: PageData }>();
	let isMobile = $state(false);

	$effect(() => {
		if (typeof window === "undefined") return;
		isMobile = window.innerWidth < 900;
	});

	const content = $derived(data.content);
	const landing = $derived(content.landing);
</script>

<svelte:head>
	<title>{lang.current === "de" ? "SxE: Kontakt" : "SxE: Contact"}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<section class="contact-section reveal" aria-labelledby="contact-title">
	<div class="contact-header">
		<p class="kicker"><Mail size={14} strokeWidth={2.2} /> {lang.t(landing.contact.kicker)}</p>
		<h2 id="contact-title">{lang.t(landing.contact.title)}</h2>
		<p class="lead">{lang.t(landing.contact.lead)}</p>
	</div>

	<div class="contact-content">
		<div class="contact-form-embed">
			{#if !isMobile}
				<iframe
					src="https://tarry-skiff-3b7.notion.site/ebd//37da031add738021959cf7d54b86ebbc"
					width="100%"
					height="600"
					frameborder="0"
					loading="lazy"
					title="Contact Form"
				></iframe>
			{:else}
				<a
					href="https://tarry-skiff-3b7.notion.site/ebd//37da031add738021959cf7d54b86ebbc"
					target="_blank"
					rel="noopener noreferrer"
					class="form-open-button"
				>
					{lang.current === "de" ? "Kontaktformular öffnen" : "Open contact form"} →
				</a>
			{/if}
		</div>
	</div>
</section>

<style>
	.contact-section {
		width: 100%;
		border: 1px solid var(--line-soft);
		border-radius: 0.9rem;
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.09), rgb(var(--rgb-white) / 0.035)),
			var(--shell-1);
		box-shadow:
			0 24px 50px rgb(var(--rgb-black) / 0.24),
			inset 0 1px 0 rgb(var(--rgb-white) / 0.1);
		padding: clamp(1.15rem, 4vw, 3rem);
		display: grid;
		gap: clamp(1.5rem, 4vw, 2.5rem);
	}

	.contact-header {
		display: grid;
		gap: 0.75rem;
	}

	.contact-content {
		display: grid;
		gap: clamp(1rem, 3vw, 2rem);
		align-items: flex-start;
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
	p,
	label {
		margin: 0;
	}

	h2,
	h3 {
		font-family: "Space Grotesk", "Manrope", sans-serif;
		color: rgb(var(--rgb-text-bright-dark));
		font-weight: 600;
	}

	h2 {
		font-size: clamp(1.65rem, 3vw, 2.75rem);
		line-height: 1.05;
	}

	#contact-title {
		max-width: 20ch;
		font-size: clamp(2rem, 5.8vw, 4.3rem);
		line-height: 1;
	}

	h3 {
		font-size: 1rem;
	}

	.lead {
		color: var(--copy-muted);
		font-size: clamp(1rem, 1.5vw, 1.15rem);
	}

	.contact-form {
		display: grid;
		gap: 0.6rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		padding: 1rem;
	}

	.contact-form label {
		color: rgb(var(--rgb-text-bright-dark));
		font-size: 0.82rem;
		font-weight: 800;
	}

	.contact-form input,
	.contact-form textarea {
		width: 100%;
		border: 1px solid var(--line-soft);
		border-radius: 0.65rem;
		background: rgb(var(--rgb-black) / 0.18);
		color: rgb(var(--rgb-text-bright-dark));
		font: inherit;
		padding: 0.72rem 0.8rem;
		resize: vertical;
	}

	.contact-form-embed {
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		padding: 1rem;
		overflow: hidden;
	}

	.contact-form-embed iframe {
		border-radius: 0.6rem;
	}

	.form-open-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.7rem 1rem;
		border-radius: 999px;
		border: 1px solid rgb(var(--rgb-brand-blue) / 0.55);
		background: rgb(var(--rgb-brand-blue));
		color: rgb(22 22 18);
		font-weight: 800;
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.form-open-button:hover {
		transform: translateY(-1px);
	}

	.form-note {
		color: rgb(255 205 130);
		font-size: 0.88rem;
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

	:global(html:not(.dark)) .contact-section {
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5)),
			rgb(var(--rgb-white));
		border-color: rgb(176 112 24 / 0.12);
		box-shadow: 0 4px 12px rgb(0 0 0 / 0.08), inset 0 1px 0 rgb(var(--rgb-white) / 0.6);
	}

	:global(html:not(.dark)) h2,
	:global(html:not(.dark)) h3 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .lead {
		color: rgb(64 84 114);
	}

	:global(html:not(.dark)) .contact-form {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.96), rgb(255 238 214 / 0.48));
	}

	:global(html:not(.dark)) .contact-form input,
	:global(html:not(.dark)) .contact-form textarea {
		border-color: rgb(var(--rgb-slate-900) / 0.18);
		background: rgb(var(--rgb-white) / 0.88);
		color: rgb(18 37 63);
	}

	@media (max-width: 640px) {
		.contact-section {
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
