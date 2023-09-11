import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
	innerSVG,
	append as svgAppend,
	attr as svgAttr,
	classes as svgClasses,
	create as svgCreate
} from 'tiny-svg';

import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500,
	TASK_BORDER_RADIUS = 2,
	COLOR_GREEN = '#52B415',
	COLOR_YELLOW = '#ffc800',
	COLOR_RED = '#cc0000';

export default class CustomRenderer extends BaseRenderer {
	constructor(eventBus, bpmnRenderer, translate) {
		super(eventBus, HIGH_PRIORITY);

		this.bpmnRenderer = bpmnRenderer;
		this.translate = translate;
	}

	canRender(element) {
		// ignore labels
		return !element.labelTarget;
	}

	drawShape(parentNode, element) {
		const moduleType = this.getModuleType(element);
		debugger;
		if (moduleType) {
			// assign(element, { width: 192, height: 55 });
			const title = this.getTitle(element);
			var playback = svgCreate('g');
			svgAttr(playback, {
				fill: 'transparent',
				width: '200'
			});
			let width = 192;
			let height = 55;
			if (moduleType == 'recorder') {
				width = element.width;
				height = element.height;
			}
			let shape = this.getShape(moduleType, width, height);
			shape += `${
				title
					? `<text font-size="14" x="55" y="38"  width="40" height="40" rx="8" fill="#262626"><tspan>${title}</tspan></text>`
					: ''
			}`;
			innerSVG(playback, shape);
			svgAppend(parentNode, playback);
			return playback;
		}
		const shape = this.bpmnRenderer.drawShape(parentNode, element);

		return shape;
	}
	getShape(type, width = 192, height = 55) {
		let shape = `<rect x="0" y="0" width="${width}" height="${height}" rx="15.5" fill="white"/>
    <rect x="0" y="0"  width="${width}" height="${height}" stroke="#F5F5F5"/>
    <rect x="8" y="8" width="40" height="40" rx="8" fill="#ECEBFF"/>`;
		let icon,
			name = this.translate(type);
		if (type == 'audio') {
			icon = `
      <path d="M28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18" stroke="#4338FF" stroke-linejoin="round" stroke-dasharray="2 4"/>
      <path d="M28 38C33.5228 38 38 33.5228 38 28C38 22.4772 33.5228 18 28 18" stroke="#4338FF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M26 24V32L32 28L26 24Z" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>`;
		}

		if (type == 'inbound-route') {
			icon = `
      <rect x="20.5" y="18.5" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="20.5" y="24" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="20.5" y="29.5" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="26.5" y="18.5" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="26.5" y="24" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="26.5" y="29.5" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="26.5" y="35" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="32.5" y="18.5" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="32.5" y="24" width="3" height="3" rx="1.5" stroke="#4338FF"/>
      <rect x="32.5" y="29.5" width="3" height="3" rx="1.5" stroke="#4338FF"/>`;
		}
		if (type == 'menu') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <path d="M21 17H18.603C16.9714 16.9999 15.4425 16.2037 14.507 14.867L13.993 14.133C13.0575 12.7963 11.5286 12.0001 9.897 12H7" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 7H18.605C16.9724 6.99993 15.4425 7.79696 14.507 9.135L13.997 9.865C13.0617 11.2028 11.5323 11.9997 9.9 12H7" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 9L21 7L19 5" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 19L21 17L19 15" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="3" y="10" width="4" height="4" rx="2" stroke="#4338FF"/>
      </g>
      `;
		}
		if (type == 'bridge') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <path d="M2.88235 3H6.64706L8.52941 7.70588L6.17647 9.11765C7.18443 11.1614 8.83856 12.8156 10.8824 13.8235L12.2941 11.4706L17 13.3529V17.1176C17 18.1572 16.1572 19 15.1176 19C7.52014 18.5383 1.4617 12.4799 1 4.88235C1 3.84276 1.84276 3 2.88235 3" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 1L13 7M13 7H16.8182M13 7V3.18182" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'timeout') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <circle cx="9" cy="11" r="8" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 6.55566V11.0001L7.5 12.5001" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 1V3" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 3L16.5321 4.28558" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'queue') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <path d="M1 15V15C1 16.1046 1.89543 17 3 17H19C20.1046 17 21 16.1046 21 15V15" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.75 13H17.25" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.75 10H17.25" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.75 7H17.25" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.75 4H17.25" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.75 1H17.25" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'recorder') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <rect x="9.215" y="3" width="5.57166" height="10.1543" rx="2.78583" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.5 10.385C5.5 13.9538 8.41027 16.8468 12.0003 16.8468C15.5903 16.8468 18.5005 13.9538 18.5005 10.385" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.28625 20.5385H15.7151" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12.0007 16.8462V20.5387" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'call-center') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <rect x="4" y="12" width="4" height="6" rx="2" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="16" y="12" width="4" height="6" rx="2" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 14V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V14" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 18C18 19.6569 15.3137 21 12 21" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'opinion') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <rect x="10.5" y="15.3309" width="3.0028" height="4.66927" rx="1" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5028 19.066C13.5028 19.5818 13.9509 19.9999 14.5037 19.9999H18.2632C18.7054 19.9999 19.0952 19.7292 19.2221 19.3341L20.4233 16.5325C20.5133 16.2495 20.5564 15.9442 20.3672 15.707C20.179 15.4698 19.8247 15.3306 19.5084 15.3306H17.5065V13.0268C17.5063 12.5743 17.1887 12.1753 16.7245 12.0441C16.2603 11.913 15.7589 12.0808 15.4897 12.4572L13.5028 15.3306V19.066H13.5028Z" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 17H5.5L4.3 18.6C3.72339 19.3688 2.5 18.961 2.5 18V7C2.5 5.34315 3.84315 4 5.5 4H17.5C19.1569 4 20.5 5.34315 20.5 7V12" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'mail-box') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <path d="M10 21V14.5C10 12.567 8.433 11 6.5 11C4.567 11 3 12.567 3 14.5V21H21V15C21 12.7909 19.2091 11 17 11H6.5" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 11V3H16L18 5L16 7H12" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.99997 15H6.99997" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'callback') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <path d="M4.38235 5H8.14706L10.0294 9.70588L7.67647 11.1176C8.68443 13.1614 10.3386 14.8156 12.3824 15.8235L13.7941 13.4706L18.5 15.3529V19.1176C18.5 20.1572 17.6572 21 16.6176 21C9.02014 20.5383 2.9617 14.4799 2.5 6.88235C2.5 5.84276 3.34276 5 4.38235 5" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 5.28577H17.5C19.1569 5.28577 20.5 6.62891 20.5 8.28577V11.0001" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.9 3L14.5 5.28571L16.9 7.57143" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'extension') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <path d="M4.07643 4.71904L7.8564 21.0001" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.07642 4.71897C6.00578 2.843 9.58976 2.28119 11.5191 4.15717C13.4485 6.03314 16.5363 6.03314 18.4657 4.15717L20.5 12.7669C18.5706 14.6428 15.4828 14.6428 13.5535 12.7669C11.6241 10.8909 8.04011 11.4527 6.11074 13.3287" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.5192 4.22681L13.5535 12.791" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.06882 8.8989C6.99818 7.02293 10.5822 6.46113 12.5115 8.3371C14.4409 10.2131 17.5287 10.2131 19.4581 8.3371" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'check-call-center-condition') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <rect x="4" y="12" width="4" height="6" rx="2" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 14V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V12" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 21C13.0929 21 14.1175 20.8539 15 20.5986" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="12" y="11" width="10" height="10" rx="5" stroke="#4338FF"/>
        <path d="M15 16.875L16.0909 18L19 15" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'check-dt-mf') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
        <path d="M13 11.5C12 10.5 11.0286 10.0001 9.397 10H6.5" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20.5 5H18.105C16.4724 4.99993 14.9425 5.79696 14.007 7.135L13.497 7.865C12.5617 9.20275 11.0323 9.99975 9.4 10H6.5" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.5 7L20.5 5L18.5 3" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="2.5" y="8" width="4" height="4" rx="2" stroke="#4338FF"/>
        <rect x="10.5" y="11" width="10" height="10" rx="5" stroke="#4338FF"/>
        <path d="M13.5 16.875L14.5909 18L17.5 15" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      `;
		}
		if (type == 'exit') {
			icon = `
      <g style="transform: translateX(16px) translateY(16px);">
	  <path d="M14 8V6C14 4.89543 13.1046 4 12 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H12C13.1046 20 14 19.1046 14 18V16" stroke="#4338FF" stroke-linecap="round" stroke-linejoin="round"/>
	  <path d="M7 11.5C6.72386 11.5 6.5 11.7239 6.5 12C6.5 12.2761 6.72386 12.5 7 12.5V11.5ZM21 12V12.5C21.2022 12.5 21.3845 12.3782 21.4619 12.1913C21.5393 12.0045 21.4966 11.7894 21.3536 11.6464L21 12ZM18.3536 8.64645C18.1583 8.45118 17.8417 8.45118 17.6464 8.64645C17.4512 8.84171 17.4512 9.15829 17.6464 9.35355L18.3536 8.64645ZM17.6464 14.6464C17.4512 14.8417 17.4512 15.1583 17.6464 15.3536C17.8417 15.5488 18.1583 15.5488 18.3536 15.3536L17.6464 14.6464ZM21.3536 12.3536C21.5488 12.1583 21.5488 11.8417 21.3536 11.6464C21.1583 11.4512 20.8417 11.4512 20.6464 11.6464L21.3536 12.3536ZM7 12.5H21V11.5H7V12.5ZM21.3536 11.6464L18.3536 8.64645L17.6464 9.35355L20.6464 12.3536L21.3536 11.6464ZM18.3536 15.3536L21.3536 12.3536L20.6464 11.6464L17.6464 14.6464L18.3536 15.3536Z" fill="#4338FF"/>
      </g>
      `;
		}
		shape += icon;
		shape += `<text font-size="12" x="55" y="20"  width="40" height="40" rx="8" fill="#B5B5B5"><tspan>${name}</tspan></text>`;
		return shape;
	}
	getTitle(element) {
		const businessObject = getBusinessObject(element);
		const { name: title } = businessObject;
		return title;
	}

	getShapePath(shape) {
		if (is(shape, 'bpmn:Task')) {
			return getRoundRectPath(shape, TASK_BORDER_RADIUS);
		}

		return this.bpmnRenderer.getShapePath(shape);
	}

	getModuleType(element) {
		const businessObject = getBusinessObject(element);

		const { moduleType } = businessObject;

		return moduleType;
	}

	getColor(suitabilityScore) {
		if (suitabilityScore > 75) {
			return COLOR_GREEN;
		} else if (suitabilityScore > 25) {
			return COLOR_YELLOW;
		}

		return COLOR_RED;
	}
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer', 'translate'];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
	const rect = svgCreate('rect');

	svgAttr(rect, {
		width: width,
		height: height,
		rx: borderRadius,
		ry: borderRadius,
		stroke: color,
		strokeWidth: 2,
		fill: color
	});

	svgAppend(parentNode, rect);

	return rect;
}
