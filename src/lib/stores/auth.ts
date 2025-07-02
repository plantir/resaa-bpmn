import { writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { env } from '$lib/stores/env';
let VITE_HSS_URL = '';
env.subscribe((value) => {
	VITE_HSS_URL = value.VITE_HSS_URL;
});
function authentication() {
	const { set, update, subscribe } = writable<any | null>(null);

	const user = writable<any>({});
	function login(token: any) {
		setLocalStorage(token);
	}
	function ndc() {
		if (!localStorage.token) return;
		let decoded_token: any = jwtDecode(localStorage.token);
		return decoded_token.profile;
	}
	async function getUserByNdc() {
		if (!localStorage.token) return;
		let decoded_token: any = jwtDecode(localStorage.token);
		let ndc = decoded_token.profile;
		let { data } = await axios.get(
			`${VITE_HSS_URL}/v2/Subscribers/EnterpriseSubscriber/Ndc/${ndc}`
		);
		user.set(data.data);
		localStorage.setItem('user', JSON.stringify(data.data));
	}
	function setLocalStorage(token: any) {
		localStorage.token = token;
	}

	function getFromLocalStorage(): any | null {
		if (localStorage.token) return localStorage.token;
		else return null;
	}

	async function isLogin(): Promise<boolean> {
		let status = false;
		await auth.subscribe((item) => {
			if (item) status = true;
			else if (getFromLocalStorage()) {
				auth.login(getFromLocalStorage()!);
				status = true;
			} else status = false;
		});
		return status;
	}
	async function token(): Promise<string> {
		let token: string = '';
		await auth.subscribe((item) => {
			if (item) token = item;
			else token = localStorage.token;
		});
		return token;
	}

	function logOut() {
		localStorage.removeItem('token');
		update(() => {
			return null;
		});
	}

	return {
		subscribe,
		ndc,
		user,
		getUserByNdc,
		token,
		login,
		logOut,
		isLogin
	};
}

export const auth = authentication();
