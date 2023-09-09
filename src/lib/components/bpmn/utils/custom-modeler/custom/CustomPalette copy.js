import { assign } from 'min-dash';
import createAction from '../../utils/createAction';
// import { getDi } from "bpmn-js/lib/util/ModelUtil";

/**
 * @typedef {import('diagram-js/lib/features/palette/Palette').default} Palette
 * @typedef {import('diagram-js/lib/features/create/Create').default} Create
 * @typedef {import('diagram-js/lib/core/ElementFactory').default} ElementFactory
 * @typedef {import('../space-tool/BpmnSpaceTool').default} SpaceTool
 * @typedef {import('diagram-js/lib/features/lasso-tool/LassoTool').default} LassoTool
 * @typedef {import('diagram-js/lib/features/hand-tool/HandTool').default} HandTool
 * @typedef {import('diagram-js/lib/features/global-connect/GlobalConnect').default} GlobalConnect
 * @typedef {import('diagram-js/lib/i18n/translate/translate').default} Translate
 *
 * @typedef {import('diagram-js/lib/features/palette/Palette').PaletteEntries} PaletteEntries
 */

/**
 * A palette provider for BPMN 2.0 elements.
 *
 * @param {Palette} palette
 * @param {Create} create
 * @param {ElementFactory} elementFactory
 * @param {SpaceTool} spaceTool
 * @param {LassoTool} lassoTool
 * @param {HandTool} handTool
 * @param {GlobalConnect} globalConnect
 * @param {Translate} translate
 */
export default function PaletteProvider(
	bpmnFactory,
	palette,
	create,
	elementFactory,
	handTool,
	globalConnect,
	translate
) {
	this._palette = palette;
	this._create = create;
	this._elementFactory = elementFactory;
	this._handTool = handTool;
	this._globalConnect = globalConnect;
	this._bpmnFactory = bpmnFactory;
	this._translate = translate;

	palette.registerProvider(this);
}

PaletteProvider.$inject = [
	'bpmnFactory',
	'palette',
	'create',
	'elementFactory',
	'handTool',
	'globalConnect',
	'translate'
];

/**
 * @return {PaletteEntries}
 */
PaletteProvider.prototype.getPaletteEntries = function () {
	var actions = {},
		create = this._create,
		elementFactory = this._elementFactory,
		handTool = this._handTool,
		globalConnect = this._globalConnect,
		translate = this._translate,
		bpmnFactory = this._bpmnFactory;
	// function createAction({ type, group, className, title, options, imageUrl }) {
	//   function createListener(event) {
	//     var shape = elementFactory.createShape(assign({ type: type }, options));

	//     if (options) {
	//       var di = getDi(shape);
	//       di.isExpanded = options.isExpanded;
	//     }

	//     create.start(event, shape);
	//   }

	//   var shortType = type.replace(/^bpmn:/, "");

	//   return {
	//     group: group,
	//     className: className,
	//     title: title || translate("Create {type}", { type: shortType }),
	//     imageUrl,
	//     action: {
	//       dragstart: createListener,
	//       click: createListener,
	//     },
	//   };
	// }

	assign(actions, {
		'hand-tool': {
			group: 'tools',
			className: 'bpmn-icon-hand-tool',
			title: translate('Activate the hand tool'),
			action: {
				click: function (event) {
					handTool.activateHand(event);
				}
			}
		},
		'global-connect-tool': {
			group: 'tools',
			className: 'global-connect-tool',
			title: translate('Activate the global connect tool'),
			action: {
				click: function (event) {
					globalConnect.start(event);
				}
			}
		},
		'tool-separator': {
			group: 'tools',
			separator: true
		},
		playback: createAction({
			create,
			bpmnFactory,
			elementFactory,
			group: 'activity',
			type: 'bpmn:StartEvent',
			module: 'playback',
			className: 'bpmn-playback',
			title: translate('Create a playback module')
		}),
		'custom-separator': {
			group: 'activity',
			separator: true
		},
		'create.start-event': createAction({
			create,
			bpmnFactory,
			elementFactory,
			type: 'bpmn:StartEvent',
			group: 'event',
			className: 'bpmn-icon-start-event-none',
			title: translate('Create StartEvent')
		})
	});

	return actions;
};
