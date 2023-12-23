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
		const endpoint = `http://172.16.100.203:9009`;
		let { data } = await axios.post(
			'http://172.16.100.203:9009',
			{},
			{
				params: {
					Action: 'AssumeRoleWithWebIdentity',
					Version: '2011-06-15',
					WebIdentityToken: localStorage.token
				}
			}
		);
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
