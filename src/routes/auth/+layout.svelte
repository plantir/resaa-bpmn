<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { EnvService } from '$lib/services/env';
	import { env } from '$lib/stores/env';
	let ready = false;
	let loading = true;

	onMount(async () => {
		const data = await EnvService.get();
		env.set(data);
		ready = true;
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
	});
</script>

{#if !loading}
	<div class="h-full bg-gray-50 flex items-center justify-center" />
{/if}
{#if ready}
	<slot />
{/if}

<style lang="postcss" global>
</style>
