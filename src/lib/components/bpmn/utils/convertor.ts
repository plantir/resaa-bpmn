import { flattenDeep } from 'lodash';

export function convertVXMLtoBPMN() {}

/**
 * @param {string} bpmn
 */
export function convertBPMNtoVXML(bpmn: string) {
	console.log(bpmn);
	let parser = new DOMParser();
	let parsed_bpmn = parser.parseFromString(bpmn, 'text/xml');
	let process = parsed_bpmn.getElementsByTagName('bpmn:process');
	let process_items: any = process[0].childNodes;
	function putItem(item: any) {
		let result = Array.isArray(item) ? [...item] : [item];
		item.childNodes.forEach((node: any) => {
			if (node.nodeName == 'bpmn:outgoing') {
				let flow_node = parsed_bpmn.getElementById(node.innerHTML);
				let targetRef = flow_node?.getAttribute('targetRef');
				let target_node = parsed_bpmn.getElementById(targetRef!);
				let target = putItem(target_node);
				result.push(target);
			}
		});
		return result;
	}

	function TreeSort(nodes: NodeListOf<ChildNode>) {
		let root: ChildNode;
		nodes.forEach((node) => {
			if (node.childNodes.length != 1) return;
			if (node.childNodes[0].nodeName == 'bpmn:outgoing') {
				root = node;
			}
		});
		if (root!) {
			let res = putItem(root);
			return flattenDeep(res);
		}
		return [];
	}
	process_items = TreeSort(process_items);
	console.log(process_items);
	let doc = document.implementation.createDocument('', '', null);
	let vxml = doc.createElement('vxml');
	const pi = doc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
	doc.insertBefore(pi, doc.firstChild);
	vxml.setAttribute('version', '2.1');
	vxml.setAttribute('xmlns', 'http://www.w3.org/2001/vxml');
	vxml.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
	vxml.setAttribute(
		'xsi:schemaLocation',
		'http://www.w3.org/2001/vxml http://www.w3.org/TR/2007/REC-voicexml21-20070619/vxml.xsd'
	);
	vxml.setAttribute('xmlns:dc', 'http://www.omg.org/spec/DD/20100524/DC');
	vxml.setAttribute('xmlns:di', 'http://www.omg.org/spec/DD/20100524/DI');
	vxml.setAttribute('xmlns:bpmn', 'http://www.omg.org/spec/BPMN/20100524/MODEL');
	let makeSubdialog = (name: string, item: HTMLFormElement) => {
		let id = item.getAttribute('id');
		let form = doc.createElement('form');
		form.setAttribute('id', id!);
		let subdialog = doc.createElement('subdialog');
		subdialog.setAttribute('src', `@Url.DocumentLink('${name}','ccxml')`);
		let attributes = item.getAttributeNames();
		attributes
			.filter((attribute) => {
				if (!attribute.includes('cpbx')) return false;
				if (attribute == 'cpbx:moduleType') return false;
				return true;
			})
			.map((attribute) => {
				let param = doc.createElement('param');
				let expr = item.getAttribute(attribute);
				if (expr == 'true' || expr == 'false') {
				} else {
					expr = `'${expr}'`;
				}
				param.setAttribute('name', attribute.replace('cpbx:', ''));
				param.setAttribute('expr', `${expr}`);
				subdialog.appendChild(param);
			});
		form.appendChild(subdialog);
		if (name == 'check-call-center-condition') {
			subdialog.setAttribute('name', `checkCondition`);
			let if_element = doc.createElement('if');
			if_element.setAttribute('cond', 'checkCondition.result');
			let else_element = doc.createElement('else');
			if_element.appendChild(else_element);
			let children = item.children;
			for (let item of children) {
				if (item.nodeName == 'bpmn:outgoing') {
					let flow = parsed_bpmn.getElementById(item.innerHTML);
					let cond = flow?.getAttribute('name');
					let next = flow?.getAttribute('targetRef');
					if (cond == 'yes') {
						let goto = makeGoTo(next!);
						if_element.prepend(goto);
					} else if (cond == 'no') {
						let goto = makeGoTo(next!);
						if_element.append(goto);
					}
				}
			}
			form.appendChild(if_element);
		}
		return form;
	};
	let makeGoTo = (id: string, single = true) => {
		let form = doc.createElement('form');
		let block = doc.createElement('block');
		let goto = doc.createElement('goto');
		goto.setAttribute('next', `#${id}`);
		block.appendChild(goto);
		form.appendChild(block);
		return single ? goto : form;
	};
	let convertItem = (item: any, appendTo) => {
		if (item.nodeName == 'bpmn:task' || item.nodeName == 'bpmn:subProcess') {
			let attributes = (<any>item).getAttributeNames();
			if (attributes.includes('cpbx:moduleType')) {
				let moduleType = item.getAttribute('cpbx:moduleType');
				let id = item.getAttribute('id');
				let is_exist = vxml.querySelector(`#${id}`);
				if (is_exist) {
					if (vxml.lastChild?.nodeName == 'block') return;
					let goto = makeGoTo(id, false);
					vxml.append(goto);
					return;
				}
				if (
					[
						'queue',
						'call-center',
						'opinion',
						'mail-box',
						'check-call-center-condition',
						'callback',
						'bridge',
						'extension'
					].includes(moduleType)
				) {
					let form = makeSubdialog(moduleType, item);
					appendTo.appendChild(form);
					return;
				}
				if (moduleType == 'menu') {
					let form = doc.createElement('form');
					form.setAttribute('id', id);
					let field = doc.createElement('field');
					field.setAttribute('name', 'choice');
					let timeout = item.getAttribute('cpbx:timeout') || '30s';
					let timeout_property = doc.createElement('property');
					timeout_property.setAttribute('name', 'timeout');
					timeout_property.setAttribute('value', timeout);
					let interdigittimeout = item.getAttribute('cpbx:interdigittimeout') || '3s';
					let interdigittimeout_property = doc.createElement('property');
					interdigittimeout_property.setAttribute('name', 'interdigittimeout');
					interdigittimeout_property.setAttribute('value', interdigittimeout);
					field.appendChild(timeout_property);
					field.appendChild(interdigittimeout_property);
					let no_input = doc.createElement('noinput');
					let filled = doc.createElement('filled');
					let if_element = doc.createElement('if');
					let no_input_child = doc.createElement('reprompt');
					let index = 0;
					for (let child of item.childNodes) {
						if (child.nodeName == 'bpmn:outgoing') {
							let flow = parsed_bpmn.getElementById(child.innerHTML);
							let dtmf = flow?.getAttribute('name');
							let next = flow?.getAttribute('targetRef');
							let cond = flow?.getAttribute('cpbx:cond');
							if (dtmf == 'noinput') {
								no_input_child = makeGoTo(next!);
								continue;
							}
							if (index == 0) {
								if_element.setAttribute('cond', cond ? cond : `choice == ${dtmf}`);
								let goto = makeGoTo(next!);
								if_element.appendChild(goto);
							} else if (dtmf == 'choice') {
								let else_element = doc.createElement('else');
								let goto = makeGoTo(next!);
								let var_element = doc.createElement('var');
								var_element.setAttribute('name', 'global_choice');
								let assign_element = doc.createElement('assign');
								assign_element.setAttribute('name', 'global_choice');
								assign_element.setAttribute('expr', 'choice');
								filled.prepend(assign_element);
								vxml.prepend(var_element);
								if_element.appendChild(else_element);
								if_element.appendChild(goto);
							} else {
								let else_if_element = doc.createElement('elseif');
								else_if_element.setAttribute('cond', cond ? cond : `choice == ${dtmf}`);
								let goto = makeGoTo(next!);
								let else_element = if_element.querySelector('else');
								if (else_element) {
									if_element.insertBefore(else_if_element, else_element);
									if_element.insertBefore(goto, else_element);
								} else {
									if_element.appendChild(else_if_element);
									if_element.appendChild(goto);
								}
							}
							index++;
						}
					}
					no_input.appendChild(no_input_child);
					field.appendChild(no_input);
					filled.appendChild(if_element);
					field.appendChild(filled);
					form.appendChild(field);
					appendTo.appendChild(form);
				}
				if (moduleType == 'check-dt-mf') {
					let id = item.getAttribute('id');
					let form = doc.createElement('form');
					form.setAttribute('id', id);
					let if_element = doc.createElement('if');
					let cond = item.getAttribute('cpbx:cond');
					cond = cond.replace('choice', 'global_choice');
					if_element.setAttribute('cond', cond);
					let else_element = doc.createElement('else');
					if_element.appendChild(else_element);
					let children = item.children;
					for (let item of children) {
						if (item.nodeName == 'bpmn:outgoing') {
							let flow = parsed_bpmn.getElementById(item.innerHTML);
							let cond = flow?.getAttribute('name');
							let next = flow?.getAttribute('targetRef');
							if (cond == 'yes') {
								let goto = makeGoTo(next!);
								if_element.prepend(goto);
							} else if (cond == 'no') {
								let goto = makeGoTo(next!);
								if_element.append(goto);
							}
						}
					}
					form.appendChild(if_element);
					appendTo.appendChild(form);
				}
				if (moduleType == 'timeout') {
					let id = item.getAttribute('id');
					let form = doc.createElement('form');
					form.setAttribute('id', id);
					let block = doc.createElement('block');
					let prompt = doc.createElement('prompt');
					let timeout = doc.createElement('break');
					let value = item.getAttribute('cpbx:timeout');
					timeout.setAttribute('time', value);
					for (let child of item.childNodes) {
						timeout.appendChild(child.cloneNode(true));
					}
					prompt.appendChild(timeout);
					block.appendChild(prompt);
					form.appendChild(block);
					appendTo.appendChild(form);
				}
				if (moduleType == 'audio') {
					let id = item.getAttribute('id');
					let form = doc.createElement('form');
					form.setAttribute('id', id);
					let block = doc.createElement('block');
					let prompt = doc.createElement('prompt');
					let audio = doc.createElement('audio');
					let src = item.getAttribute('cpbx:src');
					audio.setAttribute('src', src);
					for (let child of item.childNodes) {
						audio.append(child.cloneNode(true));
					}
					prompt.appendChild(audio);
					block.appendChild(prompt);
					form.appendChild(block);
					appendTo.appendChild(form);
				}
				if (moduleType == 'inbound-route') {
					let meta1 = doc.createElement('meta');
					let meta2 = doc.createElement('meta');
					let name = item.getAttribute('name');
					let content = item.getAttribute('cpbx:content');
					meta1.setAttribute('name', '@Meta.IVRStartNodeNumber');
					meta1.setAttribute('content', content);
					meta2.setAttribute('name', '@Meta.IVRStartNodeTitle');
					meta2.setAttribute('content', name);
					appendTo.prepend(meta1);
					appendTo.prepend(meta2);
				}
				if (moduleType == 'exit') {
					let id = item.getAttribute('id');
					let form = doc.createElement('form');
					form.setAttribute('id', id);
					let block = doc.createElement('block');
					let exit = doc.createElement('exit');
					block.append(exit);
					form.append(block);
					appendTo.appendChild(form);
				}
				if (moduleType == 'recorder') {
					let id = item.getAttribute('id');
					let form = doc.createElement('form');
					form.setAttribute('id', id);
					let recorder = doc.createElement('recorder');
					let name = item.getAttribute('name') || 'salesCallRecord';
					recorder.setAttribute('name', name);
					for (let child of item.childNodes) {
						convertItem(child, recorder);
					}
					form.append(recorder);
					appendTo.appendChild(form);
				}
			}
		}
	};
	for (let item of process_items) {
		convertItem(item, vxml);
		// if (item.nodeName == 'bpmn:sequenceFlow') {
		// 	vxml.appendChild(item.cloneNode());
		// }
	}
	let diagram = parsed_bpmn.getElementsByTagName('bpmndi:BPMNDiagram');
	// vxml.appendChild(process[0]);
	vxml.appendChild(diagram[0]);
	doc.appendChild(vxml);
	return new XMLSerializer()
		.serializeToString(doc)
		.replace(/xmlns:(bpmn|di|dc)="[^"]+"/g, function (str, ...args) {
			return '';
		});
}
