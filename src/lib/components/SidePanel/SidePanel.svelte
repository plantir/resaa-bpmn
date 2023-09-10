<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte';
	import _ from 'lodash';
	let dispatch = createEventDispatcher();
	export let open = false;
	export let data = {};
	let formData: any = {};
	let fields: any = {
		default: ['name'],
		timeout: ['name', 'timeout'],
		'inbound-route': ['name', 'content'],
		'call-center': ['name', 'callCenterId'],
		audio: ['name', 'src'],
		opinion: ['name'],
		queue: ['name', 'queueId'],
		'mail-box': ['name', 'mailBoxId', 'shouldSendSms'],
		callback: ['name', 'callbackId'],
		menu: ['name', 'timeout', 'interdigittimeout'],
		extension: ['name', 'callee'],
		bridge: ['name', 'callee'],
		'check-call-center-condition': ['name', 'callCenterId'],
		'check-dt-mf': ['name', 'cond'],
		'bpmn:SequenceFlow': ['name', 'cond']
	};
	$: open, open && getClone();
	function getClone() {
		let { businessObject } = JSON.parse(JSON.stringify(data));
		let type = businessObject.moduleType || businessObject.$type;
		let module_fields = fields[type] || fields['default'];
		formData = _.pick(businessObject, module_fields);
		for (let field of module_fields) {
			if (!formData[field]) {
				formData[field] = '';
			}
		}
	}
	function onClick() {
		open = !open;
	}
	function submit() {
		dispatch('submit', formData);
	}
	function cancel() {
		// data = Object.assign({}, clone);
		open = false;
	}
</script>

<div class="wrapper" class:open>
	<a class="btn btn-square btn-sm self-end" on:click={onClick}><i class="la la-times" /></a>
	<div class="form-section">
		<div>
			{#if formData}
				{#each Object.keys(formData) as field}
					<div class="form-control w-full mt-4">
						<span class="text-right label-text">{field}</span>
						<input
							type="text"
							bind:value={formData[field]}
							placeholder="Type here"
							class="input input-bordered w-full input-sm"
						/>
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
