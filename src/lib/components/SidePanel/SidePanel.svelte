<script lang="ts">
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
	import _ from 'lodash';
	import translate from '../bpmn/utils/custom-translate/index';
	import { minio } from '$lib/stores/minio';

	import {
		innerSVG,
		append as svgAppend,
		appendTo,
		attr as svgAttr,
		classes as svgClasses,
		create as svgCreate
	} from 'tiny-svg';
	import { getIconByType } from '../bpmn/utils/icons';
	import Uploader from './Uploader.svelte';
	import Select from './Select.svelte';
	import { GroupService } from '$lib/services/groups';
	import axios from 'axios';
	let dispatch = createEventDispatcher();
	export let open = false;
	export let data = {};
	let key = 0;
	let formData: any = [];
	let default_fields_start = [{ title: 'عنوان', model: 'name', type: 'input' }];
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
			{
				title: 'انتخاب کال سنتر',
				model: 'callcenter_id',
				type: 'select',
				placeholder: 'انتخاب کال سنتر',
				items: []
			},
			shouldRecord
		],
		audio: [...default_fields_start, { title: 'فایل صدا', model: 'src', type: 'file' }],
		sms: [...default_fields_start, { title: 'متن پیام', model: 'message', type: 'textarea' }],
		email: [
			...default_fields_start,
			{ title: 'ارسال به', model: 'to', type: 'input' },
			{ title: 'متن ایمیل', model: 'message', type: 'textarea' }
		],
		survey: [...default_fields_start, { title: 'آیدی نظر سنجی', model: 'queueId', type: 'input' }],
		queue: [...default_fields_start, { title: 'queueId', model: 'queueId', type: 'input' }],
		'mail-box': [
			...default_fields_start,
			{ title: 'mailBoxId', model: 'mailBoxId', type: 'input' },
			{ title: 'shouldSendSms', model: 'shouldSendSms', type: 'checkbox' }
		],
		'create-callback': [
			...default_fields_start,
			{ title: 'queueOwner', model: 'queueOwner', type: 'input' }
		],
		'run-callback': [
			...default_fields_start,
			{ title: 'queueOwner', model: 'queueOwner', type: 'input' }
		],
		menu: [
			...default_fields_start,
			{ title: 'timeout', model: 'timeout', type: 'input' },
			{ title: 'interdigittimeout', model: 'interdigittimeout', type: 'input' }
		],
		extension: [
			...default_fields_start,
			{ title: 'calleePhoneNumber', model: 'calleePhoneNumber', type: 'input' },
			shouldRecord
		],
		bridge: [
			...default_fields_start,
			{ title: 'calleePhoneNumber', model: 'calleePhoneNumber', type: 'input' },
			shouldRecord
		],
		'check-call-center-condition': [
			...default_fields_start,
			{ title: 'callCenterId', model: 'callCenterId', type: 'input' }
		],
		'check-dt-mf': [...default_fields_start, { title: 'cond', model: 'cond', type: 'input' }],
		'bpmn:SequenceFlow': [...default_fields_start, { title: 'cond', model: 'cond', type: 'input' }]
	};
	let title: string = 'مسیر ورودی';
	let svgWrapper: any = undefined;
	let svg: any = '';
	let type: string = '';
	let loading = false;
	$: open, open && getClone();

	function timeout(time = 100) {
		return new Promise((resolve) => {
			setTimeout(() => resolve(true), 1000);
		});
	}
	async function getClone() {
		let { businessObject } = JSON.parse(JSON.stringify(data));
		type = businessObject.moduleType || businessObject.$type;
		formData = fields[type] || fields['default'];
		for (let field of formData) {
			field[field.model] = businessObject[field.model] || '';
			if (field.model == 'callcenter_id') {
				field[field.model] = field[field.model];
				let data = await axios
					.get(`http://172.16.100.204:8072/v1/CallCenters/List?pageNumber=1&pageSize=1000`)
					.then((res) => res.data);
				field.items = data.data.items.map((item: any) => {
					return {
						text: item.name,
						value: item.id
					};
				});
				changeKey();
			}
		}
		if (!svgWrapper) {
			await timeout();
		}
		svgWrapper.innerHTML = '';
		svg = svgCreate('svg');
		svgAttr(svg, { width: '40px', height: '40px' });
		let g: any = appendTo(svgCreate('g'), svg);
		svgAttr(g, {
			fill: 'transparent'
		});
		let shape = `<svg> <rect x="0" y="0" width="40" height="40" rx="8" ry="8" fill="#d7f2f4" class="svg-bg"/>`;
		const icon_color = '#00425B';
		let icon = getIconByType(type, icon_color);
		shape += `<g style="transform:translate(-8px,-8px)" class="svg-icon">${icon}</g></svg>`;
		innerSVG(g, shape);
		svgAppend(svgWrapper, svg);
	}
	function onClick() {
		open = !open;
	}
	async function submit() {
		loading = true;
		let data: any = {};
		for (const item of formData) {
			if (item.type == 'file') {
				let name = `Audio/${item[item.model].name}`;
				await minio.putObject(name, item[item.model]);
				data[item.model] = name;
				continue;
			}
			data[item.model] = item[item.model];
		}
		dispatch('submit', data);
		loading = false;
	}
	function cancel() {
		open = false;
	}
	function changeValue(e, field) {
		if (field.type == 'checkbox') {
			field[field.model] = e.target.checked;
		} else {
			field[field.model] = e.target.value;
		}
	}
	const changeKey = () => {
		key++;
	};
	$: open, changeKey();
	onMount(() => {});
</script>

<div class="wrapper" class:open>
	{#key key}
		<div class="flex justify-between items-start">
			<div class="flex items-center">
				<div class="icon" bind:this={svgWrapper} />
				<span class="mr-2 font-bold text-lg">{translate(type)}</span>
			</div>
			<a class="btn btn-square btn-sm self-end bg-transparent" on:click={onClick}>
				<i class="la la-times" />
			</a>
		</div>
		<div class="form-section">
			<div>
				{#if formData}
					{#each formData as field}
						<div class="form-control w-full mt-4">
							<span class="text-right label-text mb-2 pr-1">{field.title}</span>
							{#if field.type == 'input'}
								<input
									type="text"
									value={field[field.model]}
									on:input={(e) => changeValue(e, field)}
									placeholder="Type here"
									class="input input-bordered w-full h-[44px] min-h-[44px]"
								/>
							{:else if field.type == 'file'}
								<Uploader bind:file={field[field.model]} />
							{:else if field.type == 'textarea'}
								<div class="flex items-center">
									<textarea
										value={field[field.model]}
										on:input={(e) => changeValue(e, field)}
										rows="36"
										placeholder="Type here"
										class="textarea textarea-bordered w-full h-24"
									/>
								</div>
							{:else if field.type == 'select'}
								<Select
									bind:value={field[field.model]}
									placeholder={field.placeholder}
									items={field.items}
								/>
							{:else if field.type == 'checkbox'}
								<div class="flex items-center">
									<input
										type="checkbox"
										checked={field[field.model]}
										on:input={(e) => changeValue(e, field)}
										bind:value={field.checked}
										placeholder="Type here"
										class="toggle toggle-secondary"
									/>
									<span class="mr-2.5">
										{field[field.model] ? 'فعال' : 'غیر فعال'}
									</span>
								</div>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>
		<!-- <div class="flex-1" /> -->
		<div class="flex gap-2 self-end mt-4 justify-between w-full">
			<button class="btn min-h-[44px] h-[44px] w-28 btn-primary" on:click={submit}>
				{#if loading}
					<span class="loading loading-spinner" />
				{:else}
					<i class="la la-save text-2xl" />ذخیره
				{/if}
			</button>
			<button class="btn min-h-[44px] h-[44px] w-20" on:click={cancel}>انصراف</button>
		</div>
	{/key}
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
