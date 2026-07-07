<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { Linkedin, Menu, Moon, Sun, X } from "lucide-svelte";
	import type { LayoutData } from "./$types";
	import { lang } from "$lib/language.svelte.ts";

	let { data, children }: { data: LayoutData; children: any } = $props();

	let themeMode = $state<"dark" | "light">("light");
	let isMobileMenuOpen = $state(false);

	const navItems = [
		{ id: "home", label: { de: "Home", en: "Home" }, href: "/" },
		{ id: "podcast", label: { de: "Podcast", en: "Podcast" }, href: "/podcast" },
		{ id: "faq", label: { de: "FAQs", en: "FAQs" }, href: "/faq" },
		{ id: "ressourcen", label: { de: "Ressourcen", en: "Resources" }, href: "/ressourcen" },
		{ id: "kontakt", label: { de: "Kontakt", en: "Contact" }, href: "/kontakt" },
		{ id: "partners", label: { de: "Partner", en: "Partners" }, href: "/partners" },
		{ id: "uber-sxe", label: { de: "Über SxE", en: "About SxE" }, href: "/uber-sxe" }
	];

	function setLanguage(nextLanguage: "de" | "en") {
		lang.set(nextLanguage);
		closeMenu();
	}

	function toggleMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMenu() {
		isMobileMenuOpen = false;
	}

	function toggleThemeMode() {
		applyThemeMode(themeMode === "dark" ? "light" : "dark");
	}

	function getCurrentThemeMode(): "dark" | "light" {
		if (typeof document === "undefined") {
			return "light";
		}
		return document.documentElement.classList.contains("dark") ? "dark" : "light";
	}

	function applyThemeMode(mode: "dark" | "light") {
		if (typeof document === "undefined") {
			return;
		}

		const root = document.documentElement;
		root.classList.toggle("dark", mode === "dark");
		root.style.colorScheme = mode;
		themeMode = mode;

		try {
			window.localStorage.setItem("sxe-theme", mode);
		} catch {
			// Ignore storage failures in restricted browser modes.
		}
	}

	function getActiveNavItem(): string {
		const pathname = $page.url.pathname;
		if (pathname === "/") return "home";
		if (pathname === "/uber-sxe") return "uber-sxe";
		if (pathname === "/faq") return "faq";
		if (pathname === "/podcast") return "podcast";
		if (pathname === "/ressourcen") return "ressourcen";
		if (pathname === "/partners") return "partners";
		if (pathname === "/kontakt") return "kontakt";
		return "";
	}

	onMount(() => {
		lang.init();
		themeMode = getCurrentThemeMode();
	});
</script>

<svelte:head>
	<script>
		(() => {
			const storageKey = "sxe-theme";
			const root = document.documentElement;

			try {
				const stored = localStorage.getItem(storageKey);
				const mode = stored === "dark" ? "dark" : "light";
				root.classList.toggle("dark", mode === "dark");
				root.style.colorScheme = mode;
			} catch {
				root.classList.remove("dark");
				root.style.colorScheme = "light";
			}
		})();
	</script>
</svelte:head>

<div class="page-shell">
	<a class="skip-link" href="#main">Skip to content</a>
	<div class="ambient" aria-hidden="true"></div>

	<header class="site-header">
		<div class="inner header-row">
			<a class="brand" href="/" onclick={closeMenu} aria-label="SxE">
				<img
					class="brand-logo"
					src="/assets/SxE%20Logo.png"
					alt="Science x Entrepreneurship"
					decoding="async"
				/>
			</a>

			<button
				type="button"
				class="menu-toggle"
				onclick={toggleMenu}
				aria-expanded={isMobileMenuOpen}
				aria-controls="site-nav"
				aria-label="Navigation umschalten"
			>
				{#if isMobileMenuOpen}
					<X size={22} />
				{:else}
					<Menu size={22} />
				{/if}
			</button>

			<nav id="site-nav" class:open={isMobileMenuOpen} aria-label="Hauptnavigation">
				{#each navItems as item (item.id)}
					<a
						href={item.href}
						class:active={getActiveNavItem() === item.id}
						onclick={closeMenu}
						aria-current={getActiveNavItem() === item.id ? "page" : undefined}
					>
						{lang.t(item.label)}
					</a>
				{/each}
				<div class="header-controls">
					<div class="language-toggle" aria-label="Language">
						<button
							type="button"
							class:active={lang.current === "de"}
							onclick={() => setLanguage("de")}
							aria-pressed={lang.current === "de"}
						>
							DE
						</button>
						<button
							type="button"
							class:active={lang.current === "en"}
							onclick={() => setLanguage("en")}
							aria-pressed={lang.current === "en"}
						>
							EN
						</button>
					</div>
					<button
						type="button"
						class="theme-toggle"
						class:light={themeMode === "light"}
						onclick={() => {
							toggleThemeMode();
							closeMenu();
						}}
						aria-label="Toggle theme"
						aria-pressed={themeMode === "light"}
					>
						<span class="theme-toggle-icon" aria-hidden="true">
							<Sun size={14} strokeWidth={2.4} />
						</span>
						<span class="theme-toggle-icon" aria-hidden="true">
							<Moon size={14} strokeWidth={2.4} />
						</span>
						<span class="theme-toggle-thumb" aria-hidden="true"></span>
					</button>
				</div>
			</nav>
		</div>
	</header>

	<main class="main-stack" id="main">
		{@render children()}
	</main>

	<footer class="site-footer reveal">
		<div class="inner footer-grid">
			<div class="footer-brand">
				<img
					class="footer-logo"
					src="/assets/SxE%20Logo.png"
					alt="Science x Entrepreneurship"
					loading="lazy"
					decoding="async"
				/>
			</div>
			<div class="footer-links">
				<a
					href="https://www.linkedin.com/company/sxe-org/"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LinkedIn"
				><Linkedin size={15} /></a>
				<a href="/impressum">{lang.current === "de" ? "Impressum" : "Imprint"}</a>
				<a href="/impressum#datenschutz">{lang.current === "de" ? "Datenschutz" : "Privacy"}</a>
			</div>
		</div>
		<p class="footer-end">© {new Date().getFullYear()} Science x Entrepreneurship</p>
	</footer>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		font-family: "Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	}

	:global(a:focus-visible),
	:global(button:focus-visible),
	:global(input:focus-visible),
	:global(textarea:focus-visible) {
		outline: 2px solid rgb(var(--rgb-focus-blue));
		outline-offset: 2px;
	}

	.page-shell {
		--shell-0: rgb(8 17 31);
		--shell-1: rgb(11 28 42);
		--shell-2: rgb(17 26 47);
		--line-soft: rgb(var(--rgb-white) / 0.12);
		--line-strong: rgb(var(--rgb-white) / 0.2);
		--copy-muted: rgb(181 192 214);
		min-height: 100vh;
		color: var(--foreground);
		position: relative;
		overflow-x: clip;
	}

	.ambient {
		position: fixed;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 10% 8%, rgb(var(--rgb-accent-blue) / 0.24), transparent 30%),
			radial-gradient(circle at 86% 14%, rgb(var(--rgb-accent-teal) / 0.16), transparent 34%),
			linear-gradient(180deg, rgb(var(--rgb-white) / 0.02), transparent 30%);
		z-index: 0;
	}

	.skip-link {
		position: absolute;
		left: 1rem;
		top: -5rem;
		padding: 0.6rem 0.9rem;
		border-radius: 0.6rem;
		background: rgb(15 23 45);
		color: rgb(var(--rgb-text-bright-dark));
		text-decoration: none;
		z-index: 50;
	}

	.skip-link:focus {
		top: 1rem;
	}

	.inner {
		width: min(1140px, calc(100% - 2.5rem));
		margin-inline: auto;
	}

	.site-header {
		position: sticky;
		top: 0;
		z-index: 40;
		backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--line-soft);
		background: rgb(6 11 20 / 0.82);
	}

	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.72rem 0;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.72rem;
		min-width: 0;
		text-decoration: none;
	}

	.brand-logo {
		display: block;
		width: auto;
		height: clamp(3.25rem, 5.4vw, 4.8rem);
		max-width: min(13.5rem, 42vw);
		object-fit: contain;
		object-position: left center;
	}

	nav,
	.header-controls,
	.language-toggle {
		display: flex;
		align-items: center;
	}

	nav {
		gap: 0.35rem;
	}

	nav a,
	.footer-links a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.1rem;
		padding: 0.25rem 0.72rem;
		border: 1px solid transparent;
		border-radius: 999px;
		color: rgb(209 220 241);
		font-size: var(--font-size-caption);
		font-weight: 700;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	nav a:hover,
	nav a.active,
	.footer-links a:hover {
		border-color: var(--line-soft);
		background: rgb(var(--rgb-white) / 0.08);
		color: rgb(var(--rgb-white));
	}

	.header-controls {
		gap: 0.4rem;
		margin-left: 0.2rem;
	}

	.language-toggle {
		padding: 0.16rem;
		border: 1px solid rgb(var(--rgb-white) / 0.16);
		border-radius: 999px;
		background: rgb(var(--rgb-white) / 0.08);
	}

	.language-toggle button {
		min-width: 2rem;
		height: 1.75rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: rgb(var(--rgb-text-soft-dark));
		font-size: var(--font-size-tiny);
		font-weight: 800;
		cursor: pointer;
	}

	.language-toggle button.active {
		background: rgb(var(--rgb-brand-blue));
		color: rgb(24 23 18);
	}

	.theme-toggle {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		width: 3.85rem;
		height: 2.1rem;
		padding: 0 0.42rem;
		border-radius: 999px;
		border: 1px solid rgb(var(--rgb-white) / 0.2);
		background: rgb(var(--rgb-white) / 0.08);
		color: rgb(var(--rgb-text-strong-dark));
		cursor: pointer;
		transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
	}

	.theme-toggle:hover {
		background: rgb(var(--rgb-white) / 0.16);
		transform: translateY(-1px);
	}

	.theme-toggle-icon {
		position: relative;
		z-index: 2;
		display: grid;
		width: 1.2rem;
		height: 1.2rem;
		place-items: center;
		color: rgb(var(--rgb-text-soft-dark));
		transition: color 0.2s ease;
	}

	.theme-toggle:not(.light) .theme-toggle-icon:last-of-type,
	.theme-toggle.light .theme-toggle-icon:first-of-type {
		color: rgb(255 246 231);
	}

	.theme-toggle-thumb {
		position: absolute;
		z-index: 1;
		top: 0.22rem;
		left: 0.22rem;
		width: 1.62rem;
		height: 1.62rem;
		border-radius: 999px;
		background: rgb(var(--rgb-brand-blue));
		box-shadow: 0 5px 12px rgb(var(--rgb-black) / 0.24);
		transform: translateX(1.72rem);
		transition: transform 0.22s ease, background-color 0.2s ease;
	}

	.theme-toggle.light .theme-toggle-thumb {
		transform: translateX(0);
		background: rgb(var(--rgb-warning-amber));
	}

	.menu-toggle {
		display: none;
		width: 2.35rem;
		height: 2.35rem;
		place-items: center;
		border: 1px solid var(--line-soft);
		border-radius: 999px;
		background: rgb(var(--rgb-white) / 0.08);
		color: rgb(var(--rgb-text-strong-dark));
		cursor: pointer;
	}

	.main-stack {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 1rem;
		width: min(1140px, calc(100% - 2.5rem));
		margin: 1rem auto 0;
	}

	.site-footer {
		position: relative;
		z-index: 1;
		margin-top: 1.1rem;
		padding: 1.4rem 0 1.6rem;
		border-top: 1px solid var(--line-soft);
		background: rgb(6 11 20 / 0.72);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 1rem;
		align-items: start;
	}

	.footer-brand {
		display: grid;
		gap: 0.5rem;
	}

	.footer-logo {
		display: block;
		width: min(12rem, 56vw);
		height: auto;
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: flex-end;
		align-items: center;
	}

	.footer-end {
		width: min(1140px, calc(100% - 2.5rem));
		margin: 1rem auto 0;
		color: rgb(145 158 183);
		font-size: var(--font-size-caption);
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

	:global(html:not(.dark)) .page-shell {
		--line-soft: rgb(var(--rgb-slate-900) / 0.12);
		--line-strong: rgb(var(--rgb-slate-900) / 0.22);
		--copy-muted: rgb(64 84 114);
		background:
			linear-gradient(180deg, rgb(249 250 252 / 0.98), rgb(246 248 251 / 0.98)),
			rgb(var(--rgb-surface-light));
	}

	:global(html:not(.dark)) .ambient {
		background:
			radial-gradient(circle at 10% 8%, rgb(88 105 128 / 0.08), transparent 30%),
			radial-gradient(circle at 86% 14%, rgb(88 105 128 / 0.06), transparent 34%),
			linear-gradient(180deg, rgb(var(--rgb-white) / 0.38), transparent 30%);
	}

	:global(html:not(.dark)) .site-header {
		background: rgb(var(--rgb-white) / 0.9);
	}

	:global(html:not(.dark)) nav a,
	:global(html:not(.dark)) .footer-links a {
		color: rgb(42 64 97);
	}

	:global(html:not(.dark)) nav a:hover,
	:global(html:not(.dark)) nav a.active,
	:global(html:not(.dark)) .footer-links a:hover {
		color: rgb(111 70 17);
		background: rgb(255 238 214 / 0.74);
		border-color: rgb(176 112 24 / 0.22);
	}

	:global(html:not(.dark)) .language-toggle,
	:global(html:not(.dark)) .theme-toggle,
	:global(html:not(.dark)) .menu-toggle {
		border-color: rgb(176 112 24 / 0.24);
		background: rgb(255 238 214 / 0.72);
		color: rgb(111 70 17);
	}

	:global(html:not(.dark)) .language-toggle button {
		color: rgb(111 70 17 / 0.72);
	}

	:global(html:not(.dark)) .site-footer {
		background: rgb(247 251 255 / 0.92);
	}

	@media (max-width: 900px) {
		.menu-toggle {
			display: grid;
		}

		nav {
			display: none;
			position: absolute;
			top: calc(100% + 0.62rem);
			left: 1.25rem;
			right: 1.25rem;
			padding: 0.65rem;
			gap: 0.35rem;
			border-radius: 0.72rem;
			border: 1px solid var(--line-soft);
			background: rgb(7 11 20 / 0.96);
			box-shadow: 0 16px 24px rgb(var(--rgb-black) / 0.34);
			flex-direction: column;
			align-items: stretch;
		}

		nav.open {
			display: flex;
		}

		nav a {
			justify-content: flex-start;
		}

		.header-controls {
			margin-left: 0;
			justify-content: space-between;
		}

		:global(html:not(.dark)) nav {
			background: rgb(var(--rgb-white) / 0.97);
			box-shadow: 0 16px 24px rgb(30 46 71 / 0.14);
		}

		.footer-links {
			justify-content: flex-start;
		}
	}

	@media (max-width: 640px) {
		.inner,
		.main-stack,
		.footer-end {
			width: calc(100% - 1.4rem);
		}

		.brand-logo {
			max-width: 9rem;
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
