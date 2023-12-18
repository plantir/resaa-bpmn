import axios from 'axios';
import { writable } from 'svelte/store';
import { auth } from './auth';
// import { Client } from 'minio';

function minioClient() {
	const { set, update, subscribe } = writable<any | null>(null);

	// function login(token: any) {
	// 	setLocalStorage(token);
	// }

	// function setLocalStorage(token: any) {
	// 	localStorage.token = token;
	// }

	// function getFromLocalStorage(): any | null {
	// 	if (localStorage.token) return localStorage.token;
	// 	else return null;
	// }

	// async function isLogin(): Promise<boolean> {
	// 	let status = false;
	// 	await auth.subscribe((item) => {
	// 		if (item) status = true;
	// 		else if (getFromLocalStorage()) {
	// 			auth.login(getFromLocalStorage()!);
	// 			status = true;
	// 		} else status = false;
	// 	});
	// 	return status;
	// }

	// function logOut() {
	// 	localStorage.removeItem('token');
	// 	update(() => {
	// 		return null;
	// 	});
	// }
	async function init() {
		// let params = {
		// 	Action: 'AssumeRoleWithWebIdentity',
		// 	Version: '2011-06-15',
		// 	WebIdentityToken: await auth.subscribe((item) => {
		// 		return item;
		// 	})
		// };
		// debugger;
		// axios.get(endPoint, {
		// 	params
		// });
		// var s3Client = new Minio.Client({
		// 	endPoint: endPoint,
		// 	accessKey: 'AccessKeyId', // AccessKeyId from the previous response
		// 	secretKey: 'SecretAccessKey', // SecretAccessKey from the previous response
		// 	sessionToken: 'SessionToken' // SessionToken from the previous response
		// });
		// update(() => {
		// 	return s3Client;
		// });
	}
	return {
		subscribe,
		init
	};
}

export const minio = minioClient();
