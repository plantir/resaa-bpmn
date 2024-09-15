<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	let msisdn = $page.params.msisdn;
	import { minio } from '$lib/stores/minio';
	import { onMount } from 'svelte';
	let objectList: Object[] = [];
	async function getList() {
		let data = await minio.getObjectList();
		objectList = data.filter((item) => item.Key?.startsWith('Vxml/') && item.Key.endsWith('.bpmn'));
		console.log(objectList);
		let id = msisdn.slice(msisdn.length - 5);
		let foundItem = objectList.find((item) => {
			console.log(id);

			return item.Key == `Vxml/${id}.bpmn`;
		});
		if (foundItem) {
			goto(`/editor/${id}.bpmn`);
		} else {
			let bpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:cpbx="http://some-company/schema/bpmn/qa" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_13i9w9f" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="14.0.0"><bpmn:process id="Process_135k828" isExecutable="false"><bpmn:task id="Activity_0u4un1e" name="${id}" cpbx:moduleType="inbound-route"><bpmn:outgoing>Flow_076dofb</bpmn:outgoing></bpmn:task><bpmn:task id="Activity_03qslty" name="" cpbx:moduleType="extension" cpbx:shouldRecord="false" cpbx:calleePhoneNumber="${msisdn}"><bpmn:incoming>Flow_076dofb</bpmn:incoming><bpmn:outgoing>Flow_06gl3kb</bpmn:outgoing></bpmn:task><bpmn:sequenceFlow id="Flow_076dofb" sourceRef="Activity_0u4un1e" targetRef="Activity_03qslty" /><bpmn:task id="Activity_1km9eu7" cpbx:moduleType="exit"><bpmn:incoming>Flow_06gl3kb</bpmn:incoming></bpmn:task><bpmn:sequenceFlow id="Flow_06gl3kb" sourceRef="Activity_03qslty" targetRef="Activity_1km9eu7" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_135k828"><bpmndi:BPMNShape id="Activity_0u4un1e_di" bpmnElement="Activity_0u4un1e"><dc:Bounds x="334" y="-197" width="192" height="55" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_03qslty_di" bpmnElement="Activity_03qslty"><dc:Bounds x="584" y="-197" width="192" height="55" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_1km9eu7_di" bpmnElement="Activity_1km9eu7"><dc:Bounds x="834" y="-197" width="192" height="55" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Flow_076dofb_di" bpmnElement="Flow_076dofb"><di:waypoint x="526" y="-169" /><di:waypoint x="584" y="-169" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_06gl3kb_di" bpmnElement="Flow_06gl3kb"><di:waypoint x="776" y="-169" /><di:waypoint x="834" y="-169" /></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;
			let vxml = `<?xml version="1.0" encoding="UTF-8"?><vxml version="2.1"
    xmlns="http://www.w3.org/2001/vxml"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xsi:schemaLocation="http://www.w3.org/2001/vxml http://www.w3.org/TR/2007/REC-voicexml21-20070619/vxml.xsd http://www.omg.org/spec/DD/20100524/DC http://www.omg.org/spec/BPMN/20100501/DC.xsd http://www.omg.org/spec/DD/20100524/DI http://www.omg.org/spec/BPMN/20100501/DI.xsd http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/20100501/BPMN20.xsd"><meta name="Meta.IVRStartNodeTitle" content="${id}"/><meta name="Meta.IVRStartNodeNumber" content="null"/><var name="globalCallerSessionId" expr=""/><var name="globalCallerConnectionId" expr=""/><var name="globalCallerPhoneNumber" expr=""/><form id="inboundRoute"><var name="callerSessionId" expr=""/><var name="callerConnectionId" expr=""/><var name="callerPhoneNumber" expr=""/><block><assign name="globalCallerSessionId" expr="callerSessionId"/><assign name="globalCallerConnectionId" expr="callerConnectionId"/><assign name="globalCallerPhoneNumber" expr="callerPhoneNumber"/></block></form><form id="Activity_03qslty" name=""><subdialog src="extension.ccxml"><param name="callerSessionId" expr="globalCallerSessionId"/><param name="callerConnectionId" expr="globalCallerConnectionId"/><param name="callerPhoneNumber" expr="globalCallerPhoneNumber"/><param name="shouldRecord" expr="false"/><param name="calleePhoneNumber" expr="'${msisdn}'"/><bpmn:incoming >Flow_076dofb</bpmn:incoming><bpmn:outgoing >Flow_06gl3kb</bpmn:outgoing></subdialog></form><form id="Activity_1km9eu7"><block><exit/></block></form><bpmndi:BPMNDiagram xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_135k828"><bpmndi:BPMNShape id="Activity_0u4un1e_di" bpmnElement="Activity_0u4un1e"><dc:Bounds  x="334" y="-197" width="192" height="55"/><bpmndi:BPMNLabel/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_03qslty_di" bpmnElement="Activity_03qslty"><dc:Bounds  x="584" y="-197" width="192" height="55"/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_1km9eu7_di" bpmnElement="Activity_1km9eu7"><dc:Bounds  x="834" y="-197" width="192" height="55"/></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Flow_076dofb_di" bpmnElement="Flow_076dofb"><di:waypoint  x="526" y="-169"/><di:waypoint  x="584" y="-169"/></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_06gl3kb_di" bpmnElement="Flow_06gl3kb"><di:waypoint  x="776" y="-169"/><di:waypoint  x="834" y="-169"/></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></vxml>`;
			await minio.putObject('Vxml/' + id + '.bpmn', bpmn);
			await minio.putObject('Vxml/' + id + '.vxml', vxml);
			setTimeout(() => {
				goto(`/editor/${id}.bpmn`);
			}, 100);
		}
	}

	onMount(async () => {
		getList();
	});
</script>

Loading....
