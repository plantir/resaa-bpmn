import fs from 'fs/promises';

export async function GET({ params }) {
	let data = await fs.readFile('./diagram.bpmn', { encoding: 'utf8' });
	return new Response(data);
}
export async function POST(ctx) {
	let { data } = await ctx.request.json();
	console.log(data);
	await fs.writeFile('./diagram.bpmn', data);
	return new Response(data);
}
