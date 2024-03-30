<script>
	import '../app.scss';
	import '../styles.css';
	import '$lib/assets/fonts/Lineawesome/_lineawesome.scss';
	import '$lib/assets/fonts/IRANSans/_iransans.scss';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	let layoutLoading = true;
	onMount(async () => {
		// const { minio } = await import('$lib/stores/minio');
		let isLogin = await auth.isLogin();
		if (isLogin) {
			await auth.getUserByNdc();
			layoutLoading = false;
		} else {
			goto('/auth/login');
			layoutLoading = false;
		}
	});
</script>

{#if layoutLoading}
	<div>loading</div>
{:else}
	<div class="app">
		<main>
			<slot />
		</main>
	</div>
{/if}

<style>
</style>
