<script lang="ts">
	import { Sparkles, ChevronDown } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();
	let language = $state<"de" | "en">("de");
	let openFaqId = $state<string | null>(null);

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

	function faqItemsForGroup(itemIds: string[]) {
		return itemIds
			.map((itemId) => landing.faq.items.find((item: any) => item.id === itemId))
			.filter((item): item is any => Boolean(item));
	}

	function faqItemNumber(itemId: string): string {
		const index = landing.faq.items.findIndex((item: any) => item.id === itemId);
		return String(index + 1).padStart(2, "0");
	}

	function toggleFaq(itemId: string) {
		openFaqId = openFaqId === itemId ? null : itemId;
	}
</script>

<svelte:head>
	<title>{t(landing.faq.title)}</title>
</svelte:head>

<section class="panel section-panel reveal" aria-labelledby="faq-title">
	<div class="section-head">
		<p class="kicker"><Sparkles size={14} strokeWidth={2.2} /> {t(landing.faq.kicker)}</p>
		<h2 id="faq-title">{t(landing.faq.title)}</h2>
		<p class="lead">{t(landing.faq.intro)}</p>
	</div>
	<div class="faq-list">
		{#each landing.faq.groups as group (t(group.title))}
			<section class="faq-group" aria-labelledby={`faq-group-${group.itemIds[0]}`}>
				<h3 id={`faq-group-${group.itemIds[0]}`} class="faq-group-title">{t(group.title)}</h3>
				{#each faqItemsForGroup(group.itemIds) as item (item.id)}
					<article class="faq-item" class:open={openFaqId === item.id}>
						<h4>
							<button
								type="button"
								aria-expanded={openFaqId === item.id}
								aria-controls={`faq-panel-${item.id}`}
								onclick={() => toggleFaq(item.id)}
							>
								<span>{faqItemNumber(item.id)}</span>
								{t(item.question)}
								<span class="faq-chevron" aria-hidden="true">
									<ChevronDown size={18} />
								</span>
							</button>
						</h4>
						<div id={`faq-panel-${item.id}`} class="faq-answer" hidden={openFaqId !== item.id}>
							<p>{t(item.answer)}</p>
						</div>
					</article>
				{/each}
			</section>
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
	}

	h2 {
		font-size: clamp(1.65rem, 3vw, 2.75rem);
		line-height: 1.05;
	}

	.lead {
		color: var(--copy-muted);
		font-size: clamp(1rem, 1.5vw, 1.15rem);
	}

	.faq-list {
		display: grid;
		gap: 1rem;
	}

	.faq-group {
		display: grid;
		gap: 0.6rem;
	}

	.faq-group-title {
		padding: 0 0.15rem;
		color: rgb(255 205 130);
		font-size: 0.98rem;
	}

	.faq-item {
		border: 1px solid rgb(var(--rgb-white) / 0.12);
		border-radius: 0.85rem;
		background: var(--shell-2);
		overflow: clip;
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.faq-item:hover {
		transform: translateY(-4px);
		border-color: rgb(var(--rgb-brand-blue) / 0.45);
		box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.22);
	}

	.faq-item h4 button {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 0.75rem;
		align-items: center;
		width: 100%;
		padding: 0.95rem 1rem;
		border: 0;
		background: transparent;
		color: rgb(var(--rgb-text-bright-dark));
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.faq-item h4 button span:first-child {
		color: rgb(255 205 130);
		font-size: 0.78rem;
		font-weight: 800;
	}

	.faq-chevron {
		transition: transform 0.22s ease;
	}

	.faq-item.open .faq-chevron {
		transform: rotate(180deg);
	}

	.faq-answer {
		display: grid;
		gap: 0.8rem;
		padding: 0 1rem 1rem 3.55rem;
		color: var(--copy-muted);
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
	:global(html:not(.dark)) h3,
	:global(html:not(.dark)) h4 {
		color: rgb(18 37 63);
	}

	:global(html:not(.dark)) .faq-item {
		border-color: rgb(176 112 24 / 0.18);
		background: linear-gradient(150deg, rgb(var(--rgb-white) / 0.97), rgb(238 246 255 / 0.5));
	}

	@media (max-width: 640px) {
		.section-panel {
			padding: 1rem;
		}

		.faq-answer {
			padding-left: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
