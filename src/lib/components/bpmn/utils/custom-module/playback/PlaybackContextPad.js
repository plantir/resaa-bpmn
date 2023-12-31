import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
export default class CustomContextPad {
	constructor(
		bpmnFactory,
		config,
		contextPad,
		create,
		elementFactory,
		injector,
		translate,
		eventBus,
		modeling,
		connect
	) {
		this.bpmnFactory = bpmnFactory;
		this.create = create;
		this.elementFactory = elementFactory;
		this.translate = translate;
		this.eventBus = eventBus;
		this.modeling = modeling;
		this.connect = connect;
		if (config.autoPlace !== false) {
			this.autoPlace = injector.get('autoPlace', false);
		}

		contextPad.registerProvider(this);
	}

	getContextPadEntries(element) {
		const {
			autoPlace,
			bpmnFactory,
			create,
			elementFactory,
			translate,
			eventBus,
			modeling,
			connect
		} = this;

		function appendServiceTask(module) {
			return function (event, element) {
				if (autoPlace) {
					const businessObject = bpmnFactory.create('bpmn:Task');

					businessObject.moduleType = module;

					const shape = elementFactory.createShape({
						type: 'bpmn:Task',
						businessObject: businessObject,
						width: 192,
						height: 55
					});

					autoPlace.append(element, shape);
				} else {
					appendServiceTaskStart(event, element);
				}
			};
		}

		function appendServiceTaskStart(module) {
			return function (event) {
				const businessObject = bpmnFactory.create('bpmn:Task');

				businessObject.moduleType = module;

				const shape = elementFactory.createShape({
					type: 'bpmn:Task',
					businessObject: businessObject,
					width: 192,
					height: 55
				});

				create.start(event, shape, element);
			};
		}

		function appendSettingEvent(event, element) {
			let businessObject = getBusinessObject(element);

			eventBus.fire('setting', { element, businessObject });
		}
		const custom_modules = [
			'inbound-route',
			'bridge',
			'timeout',
			'audio',
			'queue',
			'recorder',
			'menu',
			'call-center',
			'survey',
			'mail-box',
			'working-hours',
			'sms',
			'email',
			'callback',
			'extension',
			'check-call-center-condition',
			'check-dt-mf',
			'exit'
		];
		let context_pad = {};
		for (let item of custom_modules) {
			context_pad[`append.${item}`] = {
				group: 'model',
				className: `bpmn-${item}`,
				title: translate(`Append ${item}`),
				action: {
					dragstart: appendServiceTaskStart(item),
					click: appendServiceTask(item)
				}
			};
		}
		context_pad['setting'] = {
			group: 'model',
			className: `bpmn-setting`,
			title: translate(`Setting`),
			action: {
				click: appendSettingEvent
			}
		};
		context_pad['connect'] = {
			className: 'global-connect-tool',
			group: 'do',
			title: translate('Connect using Sequence/MessageFlow or Association'),
			action: {
				click: (event, element) => {
					connect.start(event, element);
				}
			}
		};
		context_pad['delete'] = {
			group: 'do',
			className: `bpmn-delete`,
			title: translate(`delete`),
			action: {
				click: (event, element) => {
					modeling.removeElements([element]);
				}
			}
		};
		return context_pad;
	}
}

CustomContextPad.$inject = [
	'bpmnFactory',
	'config',
	'contextPad',
	'create',
	'elementFactory',
	'injector',
	'translate',
	'eventBus',
	'modeling',
	'connect'
];
