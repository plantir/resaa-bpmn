import fs from 'fs/promises';
import * as Minio from 'minio';
import axios from 'axios';
import * as cheerio from 'cheerio';
const endPoint = `http://172.16.100.203:9009`;
export async function GET({ params, request }) {
	let WebIdentityToken = request.headers.get('Authorization')?.replace('Bearer ', '');
	let qs = {
		Action: 'AssumeRoleWithWebIdentity',
		Version: '2011-06-15',
		WebIdentityToken
	};

	let sessionToken = {
		data: `<?xml version="1.0" encoding="UTF-8"?>
		<AssumeRoleWithWebIdentityResponse xmlns="https://sts.amazonaws.com/doc/2011-06-15/"><AssumeRoleWithWebIdentityResult><AssumedRoleUser><Arn></Arn><AssumeRoleId></AssumeRoleId></AssumedRoleUser><Credentials><AccessKeyId>JM8H2JNR1DR4H9QMEYI7</AccessKeyId><SecretAccessKey>wcR9T6IRVsjC3qwA6BjLRYPH27EZ0aunp5x13RdH</SecretAccessKey><SessionToken>eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJKTThIMkpOUjFEUjRIOVFNRVlJNyIsImFtciI6WyJwd2QiXSwiYXVkIjoiYzk3ODA4OTEtYzcxNy00ZWM2LWE4ZjctMTY0MjNlZTFlYzYxIiwiYXV0aF90aW1lIjoxNzAyODg5ODcxLCJleHAiOjE3MDI4OTA2MzgsImlhdCI6MTcwMjg5MDMzOCwiaWRwIjoibG9jYWwiLCJpc3MiOiJodHRwOi8vMTcyLjE2LjEwMC4yMDM6OTAwMCIsIm5hbWUiOiJtZG91c3QiLCJuYmYiOjE3MDI4OTAzMzgsIm5vbmNlIjoiYV9yYW5kb21fc3RyaW5nIiwicG9saWN5IjoiRW50ZXJwcmlzZVBvbGljeSIsInByZWZlcnJlZF91c2VybmFtZSI6Im1kb3VzdCIsInByb2ZpbGUiOiIyMzQ1Iiwic2lkIjoiMDgwNzRBQTREQTE2NTQ4NDFGNjJBNTg3NjEwMTlDMjgiLCJzdWIiOiIyOTIzNGNhZC1kMDhkLTRlNWMtOTk4YS00OTI1NjExZTY3YzUifQ.nW7ZgkA0M8NWHPnQ6FfJ1dXkc5pPdQAbQXBRjUt-oo7nSSTjfYqWkuJ6TmzmN3-wfD-hxEXGb2xOcMg1M3k8SQ</SessionToken><Expiration>2023-12-18T09:10:38Z</Expiration></Credentials><SubjectFromWebIdentityToken>29234cad-d08d-4e5c-998a-4925611e67c5</SubjectFromWebIdentityToken></AssumeRoleWithWebIdentityResult><ResponseMetadata><RequestId>17A1E1D6E5971B46</RequestId></ResponseMetadata></AssumeRoleWithWebIdentityResponse>`
	};
	try {
		sessionToken = await axios.post(
			endPoint,
			{},
			{
				params: qs
			}
		);
	} catch (error) {}
	console.log(sessionToken);
	let doc = cheerio.load(sessionToken.data);
	console.log(doc);
	return new Response(doc);
	var s3Client = new Minio.Client({
		endPoint: endPoint,
		accessKey: 'AccessKeyId', // AccessKeyId from the previous response
		secretKey: 'SecretAccessKey', // SecretAccessKey from the previous response
		sessionToken: 'SessionToken' // SessionToken from the previous response
	});
}

export async function POST(ctx) {
	let { data } = await ctx.request.json();
	await fs.writeFile('./data/diagram.bpmn', data);
	return new Response(data);
}
