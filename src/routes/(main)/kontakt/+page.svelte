<script lang="ts">
	import { Mail, ArrowRight } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();
	let language = $state<"de" | "en">("de");
	let contactSubmitted = $state(false);

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

	function handleContactSubmit(event: SubmitEvent) {
		event.preventDefault();
		contactSubmitted = true;
	}
</script>

<svelte:head>
	<title>{t(landing.contact.title)}</title>
</svelte:head>

<section class="panel contact-panel reveal" aria-labelledby="contact-title">
	<div class="contact-copy">
		<p class="kicker"><Mail size={14} strokeWidth={2.2} /> {t(landing.contact.kicker)}</p>
		<h2 id="contact-title">{t(landing.contact.title)}</h2>
		<p class="lead">{t(landing.contact.lead)}</p>
		<a href={landing.contact.emailHref}>{landing.contact.emailLabelText}</a>
		<form class="newsletter-form" onsubmit={handleContactSubmit}>
			<h3>{t(landing.contact.newsletterTitle)}</h3>
			<p>{t(landing.contact.newsletterLead)}</p>
			<label for="newsletter-email">{t(landing.contact.newsletterEmailLabel)}</label>
			<div class="newsletter-row">
				<input
					id="newsletter-email"
					name="newsletter-email"
					type="email"
					autocomplete="email"
					placeholder={t(landing.contact.newsletterEmailPlaceholder)}
					required
				/>
				<button type="submit">{t(landing.contact.newsletterSubmitLabel)}</button>
			</div>
		</form>
	</div>

	<form class="contact-form" onsubmit={handleContactSubmit}>
		<label for="contact-name">{t(landing.contact.nameLabel)}</label>
		<input id="contact-name" name="name" autocomplete="name" required />

		<label for="contact-email">{t(landing.contact.emailLabel)}</label>
		<input id="contact-email" name="email" type="email" autocomplete="email" required />

		<label for="contact-message">{t(landing.contact.messageLabel)}</label>
		<textarea id="contact-message" name="message" rows="5" required></textarea>

		<button type="submit">{t(landing.contact.submitLabel)} <ArrowRight size={14} /></button>
		{#if contactSubmitted}
			<p class="form-note" role="status">{t(landing.contact.successMessage)}</p>
		{/if}
	</form>
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

	.contact-panel {
		display: grid;
		grid-template-columns: minmax(0, 1.12fr) minmax(280px, 0.88fr);
		gap: clamp(1rem, 3vw, 2rem);
		align-items: center;
		padding: clamp(1.15rem, 4vw, 3rem);
	}

	.contact-copy {
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
	p,
	label {
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

	h3 {
		font-size: 1rem;
	}

	.lead {
		color: var(--copy-muted);
		font-size: clamp(1rem, 1.5vw, 1.15rem);
	}

	.contact-copy a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		width: fit-content;
		color: rgb(255 205 130);
		font-weight: 800;
		text-decoration: none;
	}

	.newsletter-form,
	.contact-form {
		display: grid;
		gap: 0.6rem;
	}

	.newsletter-form {
		margin-top: 0.5rem;
		padding: 1rem;
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
	}

	.contact-form {
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		padding: 1rem;
	}

	.newsletter-form p {
		color: var(--copy-muted);
	}

	.newsletter-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.5rem;
	}

	.newsletter-form label,
	.contact-form label {
		color: rgb(var(--rgb-text-bright-dark));
		font-size: 0.82rem;
		font-weight: 800;
	}

	.newsletter-form input,
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

	.newsletter-form button,
	.contact-form button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		min-height: 2.75rem;
		padding: 0.7rem 1rem;
		margin-top: 0.25rem;
		border-radius: 999px;
		border: 1px solid rgb(var(--rgb-brand-blue) / 0.55);
		background: rgb(var(--rgb-brand-blue));
		color: rgb(22 22 18);
		font-weight: 800;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.newsletter-form button:hover,
	.contact-form button:hover {
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

	:global(html:not(.dark)) .panel {
		background:
			linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5)),
			rgb(var(--rgb-white));
	}

	:global(html:not(.dark)) h2,
	:global(html:not(.dark)) h3 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .newsletter-form,
	:global(html:not(.dark)) .contact-form {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.96), rgb(255 238 214 / 0.48));
	}

	:global(html:not(.dark)) .newsletter-form input,
	:global(html:not(.dark)) .contact-form input,
	:global(html:not(.dark)) .contact-form textarea {
		border-color: rgb(var(--rgb-slate-900) / 0.18);
		background: rgb(var(--rgb-white) / 0.88);
		color: rgb(18 37 63);
	}

	@media (max-width: 900px) {
		.contact-panel {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.contact-panel {
			padding: 1rem;
		}

		.newsletter-row {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
