<script lang="ts">
	import CustomModeler from './custom-modeler';
	import customTranslate from './custom-translate';

	import PlaybackModule from './custom-module/playback';
	import gridModule from 'diagram-js-grid';
	import qaExtension from './qa.json';
	import { onMount, createEventDispatcher } from 'svelte';
	import 'bpmn-js/dist/assets/bpmn-js.css';
	import 'bpmn-js/dist/assets/diagram-js.css';
	import './bpmn.scss';
	import { convertBPMNtoVXML, convertVXMLtoBPMN } from './convertor';
	import axios from 'axios';
	const dispatch = createEventDispatcher();
	let modeling: any;
	let modeler: any;
	// import nyanDrawModule from "bpmn-js-nyan/lib/nyan/draw";
	// import nyanPaletteModule from "bpmn-js-nyan/lib/nyan/palette";
	var customTranslateModule = {
		translate: ['value', customTranslate]
	};
	onMount(async () => {
		// let { data } = await axios.get('/api');
		let data = `<?xml version="1.0" encoding="UTF-8"?>
		<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_13i9w9f" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="14.0.0">
		  <bpmn:process id="Process_135k828" isExecutable="false" />
		  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
			<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_135k828" />
		  </bpmndi:BPMNDiagram>
		</bpmn:definitions>`;
		modeler = new CustomModeler({
			container: '#container',
			keyboard: {
				bindTo: document
			},
			additionalModules: [
				customTranslateModule,
				PlaybackModule,
				gridModule
				// nyanPaletteModule,
				// customRendererModule,
				// customModule,
				// nyanDrawModule,
			],
			moddleExtensions: {
				cpbx: qaExtension
			}
		});
		let index = 1;
		modeler
			.importXML(data)
			.then(function () {
				let palettes = document.querySelectorAll('.djs-palette .group .entry');
				palettes.forEach((element) => {
					let span = document.createElement('span');
					let title = element.getAttribute('title');
					span.classList.add('entry-title');
					span.innerHTML = title!;
					element.appendChild(span);
				});
				modeling = modeler.get('modeling');
				var eventBus = modeler.get('eventBus');
				eventBus.on('setting', (data: any) => {
					dispatch('setting:clicked', data);
					let { businessObject, element } = data;
				});
			})
			.catch(function (err: any) {
				console.error('Error', err);
			});

		let save_btn = document.getElementById('save');
		save_btn?.addEventListener('click', save);
	});

	export async function save() {
		try {
			const result = await modeler.saveXML();
			const { xml } = result;
			return xml;
			// await axios.post('/api', { data: xml });
		} catch (err) {
			console.error(err);
		}
	}
	export async function xml() {
		try {
			const result = await modeler.saveXML();
			const { xml } = result;
			return xml;
			// await axios.post('/api', { data: xml });
		} catch (err) {
			console.error(err);
		}
	}

	export async function download() {
		try {
			const result = await modeler.saveXML();
			const { xml } = result;
			debugger;
			let vxml = convertBPMNtoVXML(xml);
			var filename = 'file.xml';
			var pom = document.createElement('a');
			var bb = new Blob([vxml], { type: 'text/plain' });
			pom.setAttribute('href', window.URL.createObjectURL(bb));
			pom.setAttribute('download', filename);
			pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
			pom.draggable = true;
			pom.classList.add('dragout');
			pom.click();
			console.log(vxml);
		} catch (err) {
			console.error(err);
		}
	}

	export async function importVXML() {
		try {
			let fileInput = document.createElement('input');
			fileInput.setAttribute('type', 'file');
			fileInput.setAttribute('hidden', 'true');
			fileInput.setAttribute('accept', '.vxml,.xml,.bpmn');
			document.body.appendChild(fileInput);
			fileInput.click();
			fileInput.addEventListener('change', (ev) => {
				let selectedFile = ev.target.files[0];
				var reader = new FileReader();
				reader.onload = function (e) {
					var vxml = e.target.result;
					let bpmn = convertVXMLtoBPMN(vxml);
					console.log(bpmn);
					modeler.importXML(bpmn).catch(function (err: any) {
						alert(err);
					});
				};
				reader.readAsText(selectedFile);
			});
		} catch (err) {
			console.error(err);
		}
	}
	export async function load(bpmn: string) {
		try {
			modeler.importXML(bpmn).catch(function (err: any) {
				alert(err);
			});
		} catch (err) {
			console.error(err);
		}
	}

	export async function loadVxml(vxml: string) {
		try {
			let bpmn = convertVXMLtoBPMN(vxml);
			load(bpmn);
		} catch (err) {
			console.error(err);
		}
	}

	export async function createNew() {
		modeler.importXML(`<?xml version="1.0" encoding="UTF-8"?>
		<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_13i9w9f" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="14.0.0">
		  <bpmn:process id="Process_135k828" isExecutable="false" />
		  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
			<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_135k828" />
		  </bpmndi:BPMNDiagram>
		</bpmn:definitions>`);
	}

	export function updateNode(element: any, data: any) {
		modeling.updateProperties(element, {
			...data
		});
	}
</script>

<div id="container" />

<!-- <button class="btn btn-sm btn-primary" id="save">save</button> -->

<style lang="scss" global>
	.djs-parent {
		--palette-entry-hover-color: #d7f2f4;
	}
	#container {
		height: calc(100vh - 65px);
	}
	// button {
	// 	position: fixed;
	// 	top: 20px;
	// 	right: 200px;
	// }
</style>
