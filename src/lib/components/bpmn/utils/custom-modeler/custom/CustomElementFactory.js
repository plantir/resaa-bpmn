import { assign, forEach, isDefined, isObject, omit } from 'min-dash';

import inherits from 'inherits-browser';

import ModelUtil from 'bpmn-js/lib/util/ModelUtil';
const { getBusinessObject, getDi, is } = ModelUtil;

import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import { isExpanded } from 'bpmn-js/lib/util/DiUtil';

import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

import { ensureCompatDiRef } from 'bpmn-js/lib/util/CompatibilityUtil';

/**
 * @typedef {import('diagram-js/lib/i18n/translate/translate').default} Translate
 *
 * @typedef {import('diagram-js/lib/util/Types').Dimensions} Dimensions
 *
 * @typedef {import('./BpmnFactory').default} BpmnFactory
 *
 * @typedef {import('../../model/Types').BpmnAttributes} BpmnAttributes
 * @typedef {import('../../model/Types').Connection} Connection
 * @typedef {import('../../model/Types').Element} Element
 * @typedef {import('../../model/Types').Label} Label
 * @typedef {import('../../model/Types').Root} Root
 * @typedef {import('../../model/Types').Shape} Shape
 * @typedef {import('../../model/Types').Moddle} Moddle
 * @typedef {import('../../model/Types').ModdleElement} ModdleElement
 */

/**
 * A BPMN-specific element factory.
 *
 * @template {Connection} [T=Connection]
 * @template {Label} [U=Label]
 * @template {Root} [V=Root]
 * @template {Shape} [W=Shape]
 *
 * @extends {BaseElementFactory<T, U, V, W>}
 *
 * @param {BpmnFactory} bpmnFactory
 * @param {Moddle} moddle
 * @param {Translate} translate
 */
export default function ElementFactory(bpmnFactory, moddle, translate) {
	BaseElementFactory.call(this);
	this._bpmnFactory = bpmnFactory;
	this._moddle = moddle;
	this._translate = translate;
}

inherits(ElementFactory, BaseElementFactory);

ElementFactory.$inject = ['bpmnFactory', 'moddle', 'translate'];

ElementFactory.prototype._baseCreate = BaseElementFactory.prototype.create;

/**
 * Create a root element.
 *
 * @overlord
 * @param {'root'} elementType
 * @param {Partial<Root> & Partial<BpmnAttributes>} [attrs]
 * @return {V}
 */

/**
 * Create a shape.
 *
 * @overlord
 * @param {'shape'} elementType
 * @param {Partial<Shape> & Partial<BpmnAttributes>} [attrs]
 * @return {W}
 */

/**
 * Create a connection.
 *
 * @overlord
 * @param {'connection'} elementType
 * @param {Partial<Connection> & Partial<BpmnAttributes>} [attrs]
 * @return {T}
 */

/**
 * Create a label.
 *
 * @param {'label'} elementType
 * @param {Partial<Label> & Partial<BpmnAttributes>} [attrs]
 * @return {U}
 */
let customElements = ['cpbx:Playback'];
ElementFactory.prototype.create = function (elementType, attrs) {
	var type = attrs.type;
	if (elementType === 'label') {
		var di = attrs.di || this._bpmnFactory.createDiLabel();
		return this._baseCreate(
			elementType,
			assign(
				{ type: 'label', di: di },
				{
					width: 90,
					height: 20
				},
				attrs
			)
		);
	}
	// add type to businessObject if custom
	if (customElements.includes(type)) {
		if (!attrs.businessObject) {
			attrs.businessObject = {
				type: type
			};

			if (attrs.id) {
				assign(attrs.businessObject, {
					id: attrs.id
				});
			}
		}

		// add width and height if shape
		// if (!/:connection$/.test(type)) {
		//   assign(attrs, self._getCustomElementSize(type));
		// }

		// we mimic the ModdleElement API to allow interoperability with
		// other components, i.e. the Modeler and Properties Panel

		if (!('$model' in attrs.businessObject)) {
			Object.defineProperty(attrs.businessObject, '$model', {
				value: this._moddle
			});
		}

		if (!('$instanceOf' in attrs.businessObject)) {
			// ensures we can use ModelUtil#is for type checks
			Object.defineProperty(attrs.businessObject, '$instanceOf', {
				value: function (type) {
					return this.type === type;
				}
			});
		}

		if (!('get' in attrs.businessObject)) {
			Object.defineProperty(attrs.businessObject, 'get', {
				value: function (key) {
					return this[key];
				}
			});
		}

		if (!('set' in attrs.businessObject)) {
			Object.defineProperty(attrs.businessObject, 'set', {
				value: function (key, value) {
					return (this[key] = value);
				}
			});
		}
		let startEvent = this._bpmnFactory.create('bpmn:StartEvent');
		// END minic ModdleElement API

		return this.createElement(elementType, attrs);
	}
	return this.createElement(elementType, attrs);
};

/**
 * Create a BPMN root element.
 *
 * @overlord
 * @param {'root'} elementType
 * @param {Partial<Root> & Partial<BpmnAttributes>} [attrs]
 * @return {V}
 */

/**
 * Create a BPMN shape.
 *
 * @overlord
 * @param {'shape'} elementType
 * @param {Partial<Shape> & Partial<BpmnAttributes>} [attrs]
 * @return {W}
 */

/**
 * Create a BPMN connection.
 *
 * @param {'connection'} elementType
 * @param {Partial<Connection> & Partial<BpmnAttributes>} [attrs]
 * @return {T}
 */
ElementFactory.prototype.createElement = function (elementType, attrs) {
	var size,
		translate = this._translate;

	attrs = assign({}, attrs || {});

	var businessObject = attrs.businessObject,
		di = attrs.di;

	if (!businessObject) {
		if (!attrs.type) {
			throw new Error(translate('no shape type specified'));
		}

		businessObject = this._bpmnFactory.create(attrs.type);

		ensureCompatDiRef(businessObject);
	}

	if (!isModdleDi(di)) {
		var diAttrs = assign({}, di || {}, { id: businessObject.id + '_di' });

		if (elementType === 'root') {
			di = this._bpmnFactory.createDiPlane(businessObject, diAttrs);
		} else if (elementType === 'connection') {
			di = this._bpmnFactory.createDiEdge(businessObject, diAttrs);
		} else {
			di = this._bpmnFactory.createDiShape(businessObject, diAttrs);
		}
	}

	if (is(businessObject, 'bpmn:Group')) {
		attrs = assign(
			{
				isFrame: true
			},
			attrs
		);
	}

	attrs = applyAttributes(businessObject, attrs, [
		'processRef',
		'isInterrupting',
		'associationDirection',
		'isForCompensation'
	]);

	if (attrs.isExpanded) {
		attrs = applyAttribute(di, attrs, 'isExpanded');
	}

	if (is(businessObject, 'bpmn:SubProcess')) {
		attrs.collapsed = !isExpanded(businessObject, di);
	}

	if (is(businessObject, 'bpmn:ExclusiveGateway')) {
		di.isMarkerVisible = true;
	}

	if (isDefined(attrs.triggeredByEvent)) {
		businessObject.triggeredByEvent = attrs.triggeredByEvent;
		delete attrs.triggeredByEvent;
	}

	if (isDefined(attrs.cancelActivity)) {
		businessObject.cancelActivity = attrs.cancelActivity;
		delete attrs.cancelActivity;
	}

	var eventDefinitions, newEventDefinition;

	if (attrs.eventDefinitionType) {
		eventDefinitions = businessObject.get('eventDefinitions') || [];
		newEventDefinition = this._bpmnFactory.create(
			attrs.eventDefinitionType,
			attrs.eventDefinitionAttrs
		);

		if (attrs.eventDefinitionType === 'bpmn:ConditionalEventDefinition') {
			newEventDefinition.condition = this._bpmnFactory.create('bpmn:FormalExpression');
		}

		eventDefinitions.push(newEventDefinition);

		newEventDefinition.$parent = businessObject;
		businessObject.eventDefinitions = eventDefinitions;

		delete attrs.eventDefinitionType;
	}

	size = this.getDefaultSize(businessObject, di);

	attrs = assign(
		{
			id: businessObject.id
		},
		size,
		attrs,
		{
			businessObject: businessObject,
			di: di
		}
	);

	return this._baseCreate(elementType, attrs);
};

/**
 * Get the default size of a diagram element.
 *
 * @param {Element} element The element.
 * @param {ModdleElement} di The DI.
 *
 * @return {Dimensions} Default width and height of the element.
 */
ElementFactory.prototype.getDefaultSize = function (element, di) {
	var bo = getBusinessObject(element);
	di = di || getDi(element);

	if (is(bo, 'bpmn:SubProcess')) {
		if (isExpanded(bo, di)) {
			return { width: 350, height: 200 };
		} else {
			return { width: 100, height: 80 };
		}
	}

	if (is(bo, 'bpmn:Task')) {
		return { width: 100, height: 80 };
	}

	if (is(bo, 'bpmn:Gateway')) {
		return { width: 50, height: 50 };
	}

	if (is(bo, 'bpmn:Event')) {
		return { width: 36, height: 36 };
	}

	if (is(bo, 'bpmn:Participant')) {
		if (isExpanded(bo, di)) {
			return { width: 600, height: 250 };
		} else {
			return { width: 400, height: 60 };
		}
	}

	if (is(bo, 'bpmn:Lane')) {
		return { width: 400, height: 100 };
	}

	if (is(bo, 'bpmn:DataObjectReference')) {
		return { width: 36, height: 50 };
	}

	if (is(bo, 'bpmn:DataStoreReference')) {
		return { width: 50, height: 50 };
	}

	if (is(bo, 'bpmn:TextAnnotation')) {
		return { width: 100, height: 30 };
	}

	if (is(bo, 'bpmn:Group')) {
		return { width: 300, height: 300 };
	}
	if (is(bo, 'bpmn:startEvent')) {
		return { width: 192, height: 55 };
	}

	return { width: 100, height: 80 };
};

/**
 * Create participant.
 *
 * @param {boolean|Partial<Shape> & Partial<BpmnAttributes>} [attrs]
 * Attributes or whether the participant is expanded.
 *
 * @return {W} The created participant.
 */
ElementFactory.prototype.createParticipantShape = function (attrs) {
	if (!isObject(attrs)) {
		attrs = { isExpanded: attrs };
	}

	attrs = assign({ type: 'bpmn:Participant' }, attrs || {});

	// participants are expanded by default
	if (attrs.isExpanded !== false) {
		attrs.processRef = this._bpmnFactory.create('bpmn:Process');
	}

	return this.createShape(attrs);
};

// helpers //////////////////////

/**
 * Apply attributes from a map to the given element, remove attribute from the
 * map on application.
 *
 * @param {Element} element
 * @param {Object} attrs (in/out map of attributes)
 * @param {string[]} attributeNames name of attributes to apply
 *
 * @return {Object} changed attrs
 */
function applyAttributes(element, attrs, attributeNames) {
	forEach(attributeNames, function (property) {
		attrs = applyAttribute(element, attrs, property);
	});

	return attrs;
}

/**
 * Apply named property to element and drain it from the attrs collection.
 *
 * @param {Element} element
 * @param {Object} attrs (in/out map of attributes)
 * @param {string} attributeName to apply
 *
 * @return {Object} changed attrs
 */
function applyAttribute(element, attrs, attributeName) {
	if (attrs[attributeName] === undefined) {
		return attrs;
	}

	element[attributeName] = attrs[attributeName];

	return omit(attrs, [attributeName]);
}

/**
 * @param {Element} element
 *
 * @return {boolean}
 */
function isModdleDi(element) {
	return isAny(element, [
		'bpmndi:BPMNShape',
		'bpmndi:BPMNEdge',
		'bpmndi:BPMNDiagram',
		'bpmndi:BPMNPlane'
	]);
}
