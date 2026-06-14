<script lang="ts">
	import { Menu, X } from "lucide-svelte";

	let { isMobileMenuOpen = $bindable(false), closeMenu }: { isMobileMenuOpen?: boolean; closeMenu: () => void } = $props();

