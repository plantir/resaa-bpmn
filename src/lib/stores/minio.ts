import axios from 'axios';
import { writable } from 'svelte/store';
import { auth } from './auth';
import { jwtDecode } from 'jwt-decode';
// import { Client } from 'minio';
import { ListBucketsCommand, S3 } from '@aws-sdk/client-s3';

function minioClient() {
	const { set, update, subscribe } = writable<any | null>(null);
	let s3Client: S3 | undefined = undefined;
	async function init() {
		// let params = {
		// 	Action: 'AssumeRoleWithWebIdentity',
		// 	Version: '2011-06-15',
		// 	WebIdentityToken: await auth.subscribe((item) => {
		// 		return item;
		// 	})
		// };
		const endpoint = `http://172.16.100.203:9009`;
		const creds = {
			accessKeyId: 'YPWWYRA66LT65EDUBB6Y',
			secretAccessKey: '2bSdxaJzrloEd8cKFpa5wqZSa76eZ6EpoFwfo4Sk',
			sessionToken:
				'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJZUFdXWVJBNjZMVDY1RURVQkI2WSIsImFtciI6WyJwd2QiXSwiYXVkIjoiYzk3ODA4OTEtYzcxNy00ZWM2LWE4ZjctMTY0MjNlZTFlYzYxIiwiYXV0aF90aW1lIjoxNzAzMzM2MTE3LCJleHAiOjE3MDMzNzIxMTcsImlhdCI6MTcwMzMzNjExNywiaWRwIjoibG9jYWwiLCJpc3MiOiJodHRwOi8vMTcyLjE2LjEwMC4yMDM6OTAwMCIsIm5hbWUiOiJtZG91c3QiLCJuYmYiOjE3MDMzMzYxMTcsIm5vbmNlIjoiYV9yYW5kb21fc3RyaW5nIiwicG9saWN5IjoiRW50ZXJwcmlzZVBvbGljeSIsInByZWZlcnJlZF91c2VybmFtZSI6Im1kb3VzdCIsInByb2ZpbGUiOiIyMzQ1Iiwic2lkIjoiNDJGQkQ4RkM5MzZFNkYzNzAwQkQ5OUYyRDA2MzZBMjIiLCJzdWIiOiIyOTIzNGNhZC1kMDhkLTRlNWMtOTk4YS00OTI1NjExZTY3YzUifQ.Z15nzQTOBDS3GKp_V7MYl6qoZaTa3Tj5anHrXDqzPULcBRiDCE3Qc0w4VinoxpeLqPZRITbtRyDe5HCb1dt6pw'
		};

		s3Client = new S3({
			region: 'dummyRegion',
			endpoint: endpoint,
			credentials: creds
		});
	}
	function getBucketName() {
		let decoded_token: any = jwtDecode(localStorage.token);
		return decoded_token.profile;
	}
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
		await s3Client!.putObject({
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
