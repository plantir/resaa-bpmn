import { writable } from 'svelte/store';

function authentication() {
	const { set, update, subscribe } = writable<any | null>(null);

	function login(token: any) {
		setLocalStorage(token);
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
		token,
		login,
		logOut,
		isLogin
	};
}

export const auth = authentication();
