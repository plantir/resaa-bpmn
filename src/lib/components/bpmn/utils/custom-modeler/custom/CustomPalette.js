const SUITABILITY_SCORE_HIGH = 100,
	SUITABILITY_SCORE_AVERGE = 50,
	SUITABILITY_SCORE_LOW = 25;

export default class CustomPalette {
	constructor(bpmnFactory, create, elementFactory, palette, globalConnect, translate) {
		this.bpmnFactory = bpmnFactory;
		this.create = create;
		this.elementFactory = elementFactory;
		this.translate = translate;
		this.globalConnect = globalConnect;
		palette.registerProvider(this);
	}

	getPaletteEntries(element) {
		const { bpmnFactory, create, elementFactory, translate, globalConnect } = this;

		function createTask(module) {
			return function (event) {
				const businessObject = bpmnFactory.create('bpmn:Task');

				businessObject.moduleType = module;

				const shape = elementFactory.createShape({
					type: 'bpmn:Task',
					businessObject: businessObject,
					width: 192,
					height: 55
				});

				create.start(event, shape);
			};
		}
		let palette = {
			// "hand-tool": {
			//   group: "tools",
			//   className: "bpmn-icon-hand-tool",
			//   title: translate("Activate the hand tool"),
			//   action: {
			//     click: function (event) {
			//       handTool.activateHand(event);
			//     },
			//   },
			// },
			'global-connect-tool': {
				group: 'tools',
				className: 'global-connect-tool',
				title: translate('Create Global Connect'),
				action: {
					click: function (event) {
						globalConnect.start(event);
					}
				}
			}
			// "tool-separator": {
			//   group: "tools",
			//   separator: true,
			// },
		};

		const custom_modules = [
			'inbound-route',
			'bridge',
			'timeout',
			'audio',
			'queue',
			'recorder',
			'menu',
			'call-center',
			'opinion',
			'mail-box',
			'callback',
			'extension',
			'check-call-center-condition',
			'check-dt-mf',
			'exit'
		];

		for (let item of custom_modules) {
			palette[`create.${item}`] = {
				group: 'activity',
				className: `bpmn-${item}`,
				title: translate(`Create ${item}`),
				action: {
					dragstart: createTask(item),
					click: createTask(item)
				}
			};
		}
		return palette;
	}
}

CustomPalette.$inject = [
	'bpmnFactory',
	'create',
	'elementFactory',
	'palette',
	'globalConnect',
	'translate'
];
