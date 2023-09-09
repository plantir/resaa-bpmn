<script>
	import CustomModeler from './custom-modeler';
	import customTranslate from './custom-translate';
	import diagramXML from './newDiagram.bpmn?raw';
	import PlaybackModule from './custom-module/playback';
	import gridModule from 'diagram-js-grid';
	import qaExtension from './qa.json';
	import { onMount, createEventDispatcher } from 'svelte';
	import 'bpmn-js/dist/assets/bpmn-js.css';
	import 'bpmn-js/dist/assets/diagram-js.css';
	import './bpmn.scss';
	import { convertBPMNtoVXML, convertVXMLtoBPMN } from './convertor';
	const dispatch = createEventDispatcher();
	let modeling;
	let modeler;
	// import nyanDrawModule from "bpmn-js-nyan/lib/nyan/draw";
	// import nyanPaletteModule from "bpmn-js-nyan/lib/nyan/palette";
	var customTranslateModule = {
		translate: ['value', customTranslate]
	};
	onMount(async () => {
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
			.importXML(diagramXML)
			.then(function () {
				let palettes = document.querySelectorAll('.djs-palette .group .entry');
				palettes.forEach((element) => {
					let span = document.createElement('span');
					let title = element.getAttribute('title');
					span.classList.add('entry-title');
					span.innerHTML = title;
					element.appendChild(span);
				});
				modeling = modeler.get('modeling');
				var eventBus = modeler.get('eventBus');
				eventBus.on('setting', (data) => {
					dispatch('setting:clicked', data);
					let { businessObject, element } = data;
					// index++;
					// if (businessObject.moduleType == 'timeout') {
					// 	businessObject.timeout = businessObject.timeout ? businessObject.timeout + 1 : 30;
					// }
					// businessObject.name = businessObject.name + index;
					// modeling.updateProperties(element, {
					// 	...businessObject
					// });
				});
			})
			.catch(function (err) {
				console.error('Error', err);
			});
		let save_btn = document.getElementById('save');
		save_btn?.addEventListener('click', save);
	});
	export async function save() {
		try {
			const result = await modeler.saveXML();
			const { xml } = result;
			let vxml = convertBPMNtoVXML(xml);
			console.log(vxml);
		} catch (err) {}
	}
	export function updateNode(element, data) {
		debugger;
		modeling.updateProperties(element, {
			...data
		});
	}
</script>

<div id="container" />

<button class="btn btn-sm btn-primary" id="save">save</button>

<style lang="scss" global>
	#container {
		height: calc(100vh - 65px);
	}
	button {
		position: fixed;
		top: 20px;
		right: 200px;
	}
</style>
