<script>
	import './app.scss';
	import './styles.css';
	import '$lib/assets/fonts/Lineawesome/_lineawesome.scss';
	import '$lib/assets/fonts/IRANSans/_iransans.scss';
</script>

<svelte:head>
	<!-- <link
		href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/> -->
	<!-- <link
		rel="stylesheet"
		href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css"
	/> -->
</svelte:head>
<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
</style>
