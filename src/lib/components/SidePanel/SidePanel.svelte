<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte';
	import _ from 'lodash';
	let dispatch = createEventDispatcher();
	export let open = false;
	export let data = {};
	let formData: any = [];
	let default_fields_start = [{ title: 'name', model: 'name', type: 'input' }];
	let shouldRecord = { title: 'shouldRecord', model: 'shouldRecord', type: 'checkbox' };
	let fields: any = {
		default: [...default_fields_start],
		timeout: [...default_fields_start, { title: 'timeout', model: 'timeout', type: 'input' }],
		'inbound-route': [
			...default_fields_start,
			{ title: 'content', model: 'content', type: 'input' }
		],
		'call-center': [
			...default_fields_start,
			{ title: 'callCenterId', model: 'callCenterId', type: 'input' },
			shouldRecord
		],
		audio: [...default_fields_start, { title: 'src', model: 'src', type: 'input' }],
		opinion: [...default_fields_start],
		queue: [...default_fields_start, { title: 'queueId', model: 'queueId', type: 'input' }],
		'mail-box': [
			...default_fields_start,
			{ title: 'mailBoxId', model: 'mailBoxId', type: 'input' },
			{ title: 'shouldSendSms', model: 'shouldSendSms', type: 'checkbox' }
		],
		callback: [
			...default_fields_start,
			{ title: 'callbackId', model: 'callbackId', type: 'input' }
		],
		menu: [
			...default_fields_start,
			{ title: 'timeout', model: 'timeout', type: 'input' },
			{ title: 'interdigittimeout', model: 'interdigittimeout', type: 'input' }
		],
		extension: [
			...default_fields_start,
			{ title: 'callee', model: 'callee', type: 'input' },
			shouldRecord
		],
		bridge: [
			...default_fields_start,
			{ title: 'callee', model: 'callee', type: 'input' },
			shouldRecord
		],
		'check-call-center-condition': [
			...default_fields_start,
			{ title: 'callCenterId', model: 'callCenterId', type: 'input' }
		],
		'check-dt-mf': [...default_fields_start, { title: 'cond', model: 'cond', type: 'input' }],
		'bpmn:SequenceFlow': [...default_fields_start, { title: 'cond', model: 'cond', type: 'input' }]
	};
	$: open, open && getClone();
	function getClone() {
		let { businessObject } = JSON.parse(JSON.stringify(data));
		let type = businessObject.moduleType || businessObject.$type;
		formData = fields[type] || fields['default'];
		debugger;
		// formData = _.pick(
		// 	businessObject,
		// 	module_fields.map((item) => item.model)
		// );

		for (let field of formData) {
			field[field.model] = businessObject[field.model] || '';
			console.log(field);
		}
	}
	function onClick() {
		open = !open;
	}
	function submit() {
		let data: any = {};
		for (const item of formData) {
			data[item.model] = item[item.model];
		}
		dispatch('submit', data);
	}
	function cancel() {
		// data = Object.assign({}, clone);
		open = false;
	}
	function changeValue(e, field) {
		// console.log(e.target.value);
		// console.log(field);
		if (field.type == 'checkbox') {
			field[field.model] = e.target.checked;
		} else {
			field[field.model] = e.target.value;
		}
	}
</script>

<div class="wrapper" class:open>
	<a class="btn btn-square btn-sm self-end" on:click={onClick}><i class="la la-times" /></a>
	<div class="form-section">
		<div>
			{#if formData}
				{#each formData as field}
					<div class="form-control w-full mt-4">
						<span class="text-right label-text">{field.title}</span>
						{#if field.type == 'input'}
							<input
								type="text"
								value={field[field.model]}
								on:input={(e) => changeValue(e, field)}
								placeholder="Type here"
								class="input input-bordered w-full input-sm"
							/>
						{:else if field.type == 'checkbox'}
							<input
								type="checkbox"
								checked={field[field.model]}
								on:input={(e) => changeValue(e, field)}
								placeholder="Type here"
								class="checkbox"
							/>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
	<div class="flex-1" />
	<div class="flex gap-2 self-end">
		<button class="btn w-32 btn-sm btn-primary" on:click={submit}>ذخیره</button>
		<button class="btn w-32 btn-sm" on:click={cancel}>انصراف</button>
	</div>
</div>

<style lang="scss">
	.wrapper {
		direction: rtl;
		padding: 24px;
		width: 340px;
		height: 100vh;
		background: #fff;
		border-left: 1px solid #eee;
		position: fixed;
		top: 0;
		right: 0;
		transform: translateX(440px);
		transition: transform 0.2s ease-in-out;
		z-index: 999;
		display: flex;
		flex-direction: column;
		height: 100%;
		&.open {
			transform: translateX(0);
		}
	}
	.form-section {
	}
</style>
