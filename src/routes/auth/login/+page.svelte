<script>
	import { goto } from '$app/navigation';
	import axios from '$lib/services/axios';
	import { onMount } from 'svelte';
	import { env } from '$lib/stores/env';
	// let base_url = 'http://bpmn.arminpro.com'
	let base_url = $env.VITE_BASE_URL; //'http://localhost:5174/';
	let callback_url = `${base_url}/auth/callback`;
	let auth_location = `${$env.VITE_CAS_URL}/connect/authorize?client_id=c9780891-c717-4ec6-a8f7-16423ee1ec61&scope=openid%20profile&response_type=id_token&redirect_uri=${callback_url}&nonce=a_random_string`;
	// auth_location = `http://172.16.100.203:9000/connect/authorize?client_id=c9780891-c717-4ec6-a8f7-16423ee1ec61&scope=openid%20profile&response_type=id_token&redirect_uri=http://frontend.svc/oauth_callback&nonce=a_random_string`;
	console.log(callback_url);
	onMount(() => {
		// console.log(auth_location);
		// goto(auth_location);
	});
</script>

redirecting...
