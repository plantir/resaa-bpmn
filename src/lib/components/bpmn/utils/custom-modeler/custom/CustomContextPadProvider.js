import inherits from 'inherits';

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import { assign, bind } from 'min-dash';

export default function CustomContextPadProvider(injector, connect, translate) {
	injector.invoke(ContextPadProvider, this);
	debugger;
	var cached = bind(this.getContextPadEntries, this);

	this.getContextPadEntries = function (element) {
		var actions = cached(element);
		var businessObject = element.businessObject;
		function startConnect(event, element, autoActivate) {
			connect.start(event, element, autoActivate);
		}
		if (actions['delete']) actions['delete'].className = 'bpmn-delete';
		assign(actions, {});

		return {}; //actions;
	};
}

inherits(CustomContextPadProvider, ContextPadProvider);

CustomContextPadProvider.$inject = ['injector', 'connect', 'translate'];
