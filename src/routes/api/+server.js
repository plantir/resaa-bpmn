import fs from 'fs/promises';

export async function GET({ params }) {
	try {
		let data = await fs.readFile('./data/diagram.bpmn', { encoding: 'utf8' });
		return new Response(data);
	} catch (error) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?>
		<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_13i9w9f" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="14.0.0">
		  <bpmn:process id="Process_135k828" isExecutable="false" />
		  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
			<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_135k828" />
		  </bpmndi:BPMNDiagram>
		</bpmn:definitions>
		`);
	}
}

export async function POST(ctx) {
	let { data } = await ctx.request.json();
	await fs.writeFile('./data/diagram.bpmn', data);
	return new Response(data);
}
