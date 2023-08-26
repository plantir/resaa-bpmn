<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte';
	import _ from 'lodash';
	let dispatch = createEventDispatcher();
	export let open = false;
	export let data = {};
	let formData = {};
	let fields = {
		timeout: ['name', 'timeout']
	};
	$: open, open && getClone();
	function getClone() {
		let { businessObject } = JSON.parse(JSON.stringify(data));
		debugger;
		formData = _.pick(businessObject, fields[businessObject.moduleType]);
		console.log(formData);
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
				<div class="form-control w-full">
					<span class="text-right label-text">عنوان</span>
					<input
						type="text"
						bind:value={formData.name}
						placeholder="Type here"
						class="input input-bordered w-full input-sm"
					/>
				</div>
				<div class="form-control w-full mt-4">
					<span class="text-right label-text">مقدار وقفه</span>
					<input
						type="text"
						bind:value={formData.timeout}
						placeholder="Type here"
						class="input input-bordered w-full input-sm"
					/>
				</div>
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
