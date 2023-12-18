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
		// (await auth.isLogin()) ? (layoutLoading = false) : goto('/auth/login');
		// let minioClient = await minio.init();
		layoutLoading = false;
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
