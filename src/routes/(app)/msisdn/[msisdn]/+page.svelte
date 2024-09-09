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
		let foundItem = objectList.find((item) => {
			return item.Key == `Vxml/${msisdn}.bpmn`;
		});
		if (foundItem) {
			goto(`/editor/${msisdn}.bpmn`);
		} else {
			let bpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:cpbx="http://some-company/schema/bpmn/qa" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_13i9w9f" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="14.0.0"><bpmn:process id="Process_135k828" isExecutable="false"><bpmn:task id="Activity_0u4un1e" name="${msisdn}" cpbx:moduleType="inbound-route"><bpmn:outgoing>Flow_1lye90p</bpmn:outgoing></bpmn:task><bpmn:task id="Activity_0q4mpju" cpbx:moduleType="exit"><bpmn:incoming>Flow_1lye90p</bpmn:incoming></bpmn:task><bpmn:sequenceFlow id="Flow_1lye90p" sourceRef="Activity_0u4un1e" targetRef="Activity_0q4mpju" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_135k828"><bpmndi:BPMNShape id="Activity_0u4un1e_di" bpmnElement="Activity_0u4un1e"><dc:Bounds x="504" y="-197" width="192" height="55" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_0q4mpju_di" bpmnElement="Activity_0q4mpju"><dc:Bounds x="894" y="-196" width="192" height="55" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Flow_1lye90p_di" bpmnElement="Flow_1lye90p"><di:waypoint x="696" y="-169" /><di:waypoint x="894" y="-168" /></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;
			let vxml = `<?xml version="1.0" encoding="UTF-8"?><vxml version="2.1"
    xmlns="http://www.w3.org/2001/vxml"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xsi:schemaLocation="http://www.w3.org/2001/vxml http://www.w3.org/TR/2007/REC-voicexml21-20070619/vxml.xsd http://www.omg.org/spec/DD/20100524/DC http://www.omg.org/spec/BPMN/20100501/DC.xsd http://www.omg.org/spec/DD/20100524/DI http://www.omg.org/spec/BPMN/20100501/DI.xsd http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/20100501/BPMN20.xsd"><meta name="Meta.IVRStartNodeTitle" content="${msisdn}"/><meta name="Meta.IVRStartNodeNumber" content="null"/><var name="globalCallerSessionId" expr=""/><var name="globalCallerConnectionId" expr=""/><var name="globalCallerPhoneNumber" expr=""/><form id="inboundRoute"><var name="callerSessionId" expr=""/><var name="callerConnectionId" expr=""/><var name="callerPhoneNumber" expr=""/><block><assign name="globalCallerSessionId" expr="callerSessionId"/><assign name="globalCallerConnectionId" expr="callerConnectionId"/><assign name="globalCallerPhoneNumber" expr="callerPhoneNumber"/></block></form><form id="Activity_0q4mpju"><block><exit/></block></form><bpmndi:BPMNDiagram xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_135k828"><bpmndi:BPMNShape id="Activity_0u4un1e_di" bpmnElement="Activity_0u4un1e"><dc:Bounds  x="504" y="-197" width="192" height="55"/><bpmndi:BPMNLabel/></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_0q4mpju_di" bpmnElement="Activity_0q4mpju"><dc:Bounds  x="894" y="-196" width="192" height="55"/></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Flow_1lye90p_di" bpmnElement="Flow_1lye90p"><di:waypoint  x="696" y="-169"/><di:waypoint  x="894" y="-168"/></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></vxml>`;
			await minio.putObject('Vxml/' + msisdn + '.bpmn', bpmn);
			await minio.putObject('Vxml/' + msisdn + '.vxml', vxml);
			setTimeout(() => {
				goto(`/editor/${msisdn}.bpmn`);
			}, 100);
		}
	}

	onMount(async () => {
		getList();
	});
</script>

Loading....
