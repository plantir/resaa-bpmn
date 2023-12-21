import axios from 'axios';
import { writable } from 'svelte/store';
import { auth } from './auth';
// import { Client } from 'minio';
import { S3 } from '@aws-sdk/client-s3';
const AccessKeyId = '7GISXQW0WQPCDOP66KBQ',
	SecretKey = 'GYMqmsz0vsLogUzmmdmrlLuFjfZ+EbLqz0SCrZL2',
	SessionToken =
		'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI3R0lTWFFXMFdRUENET1A2NktCUSIsImFtciI6WyJwd2QiXSwiYXVkIjoiYzk3ODA4OTEtYzcxNy00ZWM2LWE4ZjctMTY0MjNlZTFlYzYxIiwiYXV0aF90aW1lIjoxNzAzMDcyODM2LCJleHAiOjE3MDMwNzMxMzYsImlhdCI6MTcwMzA3MjgzNiwiaWRwIjoibG9jYWwiLCJpc3MiOiJodHRwOi8vMTcyLjE2LjEwMC4yMDM6OTAwMCIsIm5hbWUiOiJtZG91c3QiLCJuYmYiOjE3MDMwNzI4MzYsIm5vbmNlIjoiYV9yYW5kb21fc3RyaW5nIiwicG9saWN5IjoiRW50ZXJwcmlzZVBvbGljeSIsInByZWZlcnJlZF91c2VybmFtZSI6Im1kb3VzdCIsInByb2ZpbGUiOiIyMzQ1Iiwic2lkIjoiNjA3NDE4MDk5NDY4MTQ4MjhDRTQzNkYwNDJDMjQyNkIiLCJzdWIiOiIyOTIzNGNhZC1kMDhkLTRlNWMtOTk4YS00OTI1NjExZTY3YzUifQ.wqtL8nmv1wKcx_ImFp8VDqzw_fceLjhYp7P8z9epJTOA4-nHeMwVDS-h_Gq9aTGFrtJ5Y0ldSiroV4utouZSxA';
const endpoint = `http://172.16.100.203:9009`;
const creds = {
	accessKeyId: AccessKeyId,
	secretAccessKey: SecretKey,
	sessionToken: SessionToken
};

const s3Client = new S3({
	// apiVersion: '2006-03-01'
	region: 'dummyRegion',
	endpoint: endpoint,
	credentials: creds
});

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
		let data = await s3Client.createBucket({ Bucket: 'test' });
		console.log(data);
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
