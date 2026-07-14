<script lang="ts">
	import { Trash2, CheckCircle2, XCircle, ArrowLeft } from "lucide-svelte";
	import type { PageData, ActionData } from "./$types";

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<svelte:head>
	<title>SxE: Unsubscribe</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="status-page">
	<div class="ambient" aria-hidden="true"></div>
	<main class="status-main">
		{#if form?.deleted}
			<CheckCircle2 size={40} strokeWidth={1.75} class="status-icon success" />
			<h1>Your data has been deleted</h1>
			<p>
				You've been removed from the SxE newsletter and your email address has been permanently
				deleted from our database.
			</p>
		{:else if data.valid}
			<Trash2 size={40} strokeWidth={1.75} class="status-icon" />
			<h1>Unsubscribe &amp; delete your data</h1>
			<p>This removes your email address from our newsletter list and deletes it permanently.</p>
			<form method="POST">
				<input type="hidden" name="token" value={data.token} />
				<button type="submit">Confirm deletion</button>
			</form>
		{:else}
			<XCircle size={40} strokeWidth={1.75} class="status-icon" />
			<h1>Link invalid</h1>
			<p>This unsubscribe link doesn't look right, or your data has already been deleted.</p>
		{/if}
		<a class="back-link" href="/"><ArrowLeft size={15} /> Back to SxE</a>
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: "Manrope", "Avenir Next", sans-serif;
		background: var(--background);
	}

	.status-page {
		min-height: 100vh;
		position: relative;
		overflow: clip;
		color: var(--foreground);
	}

	.ambient {
		position: fixed;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 10% 10%, rgb(var(--rgb-accent-blue) / 0.22), transparent 30%),
			radial-gradient(circle at 86% 15%, rgb(var(--rgb-accent-teal) / 0.12), transparent 35%);
		z-index: 0;
	}

	.status-main {
		position: relative;
		z-index: 1;
		width: min(480px, calc(100% - 2rem));
		margin: 0 auto;
		min-height: 100vh;
		display: grid;
		justify-items: center;
		align-content: center;
		gap: 0.85rem;
		text-align: center;
		padding: 2rem 0;
	}

	:global(.status-icon) {
		color: rgb(var(--rgb-brand-blue));
	}

	:global(.status-icon.success) {
		color: rgb(110 190 140);
	}

	h1 {
		margin: 0;
		font-family: "Space Grotesk", "Manrope", sans-serif;
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 600;
	}

	p {
		margin: 0;
		color: rgb(var(--rgb-text-soft-dark));
		max-width: 40ch;
		line-height: 1.6;
	}

	form {
		margin-top: 0.5rem;
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.75rem;
		padding: 0.7rem 1.3rem;
		border-radius: 999px;
		border: 1px solid rgb(220 90 90 / 0.6);
		background: rgb(220 90 90);
		color: rgb(20 10 10);
		font-weight: 800;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	button:hover {
		transform: translateY(-1px);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.75rem;
		height: 2.15rem;
		padding: 0 0.9rem;
		border-radius: 999px;
		border: 1px solid rgb(var(--rgb-white) / 0.14);
		background: rgb(var(--rgb-white) / 0.04);
		color: rgb(215 227 247);
		text-decoration: none;
		font-size: var(--font-size-caption);
		font-weight: 700;
	}

	.back-link:hover {
		background: rgb(var(--rgb-white) / 0.1);
	}

	:global(html:not(.dark)) p {
		color: rgb(64 84 114);
	}

	:global(html:not(.dark)) .back-link {
		border-color: rgb(176 112 24 / 0.24);
		background: rgb(255 238 214 / 0.6);
		color: rgb(111 70 17);
	}
</style>
