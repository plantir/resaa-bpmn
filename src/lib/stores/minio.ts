import axios from 'axios';
import { writable } from 'svelte/store';
import { auth } from './auth';
import { jwtDecode } from 'jwt-decode';
// import { Client } from 'minio';
import { ListBucketsCommand, S3 } from '@aws-sdk/client-s3';
import { goto } from '$app/navigation';
import { env } from '$lib/stores/env';
let VITE_MINIO_URL = '';
env.subscribe((value) => {
	VITE_MINIO_URL = value.VITE_MINIO_URL;
});
function minioClient() {
	const { set, update, subscribe } = writable<any | null>(null);
	let s3Client: S3 | undefined = undefined;
	async function init() {
		const endpoint = VITE_MINIO_URL;
		try {
			let { data } = await axios({
				method: 'post',
				url: VITE_MINIO_URL,
				withCredentials: false,
				params: {
					Action: 'AssumeRoleWithWebIdentity',
					Version: '2011-06-15',
					WebIdentityToken: localStorage.token
				}
			});

			let [l, secretKey] = data.match(/<SecretAccessKey>(.+)<\/SecretAccessKey>/);
			let [m, accessKey] = data.match(/<AccessKeyId>(.+)<\/AccessKeyId>/);
			let [n, sessionToken] = data.match(/<SessionToken>(.+)<\/SessionToken>/);
			const creds = {
				accessKeyId: accessKey,
				secretAccessKey: secretKey,
				sessionToken: sessionToken
			};

			s3Client = new S3({
				region: 'dummyRegion',
				endpoint: endpoint,
				credentials: creds,
				forcePathStyle: true
			});
			// await createBucket('Audio');
		} catch (error) {
			if (error.response.data.includes('InvalidParameterValue')) {
				localStorage.removeItem('token');
				goto('/auth/login');
			}
		}
	}
	function getBucketName() {
		let decoded_token: any = jwtDecode(localStorage.token);
		return decoded_token.profile;
	}
	// async function createBucket(bucket: string) {
	// 	if (!s3Client) await init();
	// 	try {
	// 		let data = await s3Client!.createBucket({
	// 			Bucket: getBucketName() + `/${bucket}`
	// 		});
	// 		return data.Location || [];
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
	async function getObjectList() {
		if (!s3Client) await init();
		let data = await s3Client!.listObjects({
			Bucket: getBucketName()
		});
		return data.Contents || [];
	}
	async function getObject(key: string) {
		if (!s3Client) await init();
		let data = await s3Client!.getObject({
			ResponseCacheControl: 'no-cache',
			Bucket: getBucketName(),
			Key: key
		});
		return data;
	}
	async function deleteObject(key: string) {
		if (!s3Client) await init();
		let data = await s3Client!.deleteObject({
			Bucket: getBucketName(),
			Key: key
		});
		return data;
	}

	async function putObject(name: string, data: string) {
		if (!s3Client) await init();
		return s3Client!.putObject({
			Bucket: getBucketName(),
			Key: name,
			Body: data
		});
	}

	return {
		s3Client,
		getObjectList,
		getObject,
		deleteObject,
		putObject,
		init
	};
}

export const minio = minioClient();
