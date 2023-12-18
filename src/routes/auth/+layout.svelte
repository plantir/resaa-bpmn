<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';

	let loading = true;

	onMount(async () => {
		if ($page.url.hash) {
			try {
				let token = $page.url.hash.split('&')[0].replace('#id_token=', '');
				auth.login(token);
				loading = false;
				goto('/');
			} catch (error) {}
		} else {
			goto('/auth/login');
		}
		// (await auth.isLogin()) ?  goto('/') : (loading = false);
	});
</script>

{#if !loading}
	<div class="h-full bg-gray-50 flex items-center justify-center" />
{/if}
<slot />

<style lang="postcss" global>
</style>
