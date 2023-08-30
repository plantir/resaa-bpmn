export function convertVXMLtoBPMN() {}

/**
 * @param {string} bpmn
 */
export function convertBPMNtoVXML(bpmn) {
	let vxml_head = `<?xml version="1.0" encoding="UTF-8"?>
    <vxml version="2.1" xmlns="http://www.w3.org/2001/vxml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.w3.org/2001/vxml http://www.w3.org/TR/2007/REC-voicexml21-20070619/vxml.xsd"
        xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
        xmlns:di="http://www.omg.org/spec/DD/20100524/DI">
    `;
	let vxml_foot = `</vxml>`;
	let parser = new DOMParser();
	let parsed_bpmn = parser.parseFromString(bpmn, 'text/xml');
	let process = parsed_bpmn.getElementsByTagName('bpmn:process');
	let process_items = process[0].childNodes;
	let doc = document.implementation.createDocument('', '', null);
	let vxml = doc.createElement('vxml');
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
	console.log(process_items);

	for (let item of process_items) {
		if (item.nodeName == 'bpmn:task') {
			let attributes = item.getAttributeNames();
			if (attributes.includes('cpbx:moduleType')) {
				let moduleType = item.getAttribute('cpbx:moduleType');
				if (moduleType == 'timeout') {
					let block = doc.createElement('block');
					let prompt = doc.createElement('prompt');
					let timeout = doc.createElement('break');
					let value = item.getAttribute('cpbx:timeout');
					timeout.setAttribute('time', value);
					for (let child of item.childNodes) {
						timeout.appendChild(child);
					}
					prompt.appendChild(timeout);
					block.appendChild(prompt);
					vxml.appendChild(block);
				}
			}
		}
		if (item.nodeName == 'bpmn:sequenceFlow') {
			vxml.appendChild(item.cloneNode());
		}
	}
	let meta1 = doc.createElement('meta');
	let meta2 = doc.createElement('meta');
	meta1.setAttribute('name', '@Meta.IVRStartNodeNumber');
	meta1.setAttribute('content', '09123456789');
	meta2.setAttribute('name', '@Meta.IVRStartNodeTitle');
	meta2.setAttribute('content', 'Inbound Route');
	vxml.prepend(meta1);
	vxml.prepend(meta2);
	doc.appendChild(vxml);
	console.log(doc);
	return vxml_head + vxml_foot;
}
