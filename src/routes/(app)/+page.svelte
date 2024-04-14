<script lang="ts">
	import { onMount } from 'svelte';
	import { minio } from '$lib/stores/minio';
	import type { _Object } from '@aws-sdk/client-s3';
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/Modal/Modal.svelte';

	import moment from 'moment-jalaali';
	moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
	import { replace } from 'tiny-svg';
	let modal = false;
	let objectList: _Object[] = [];
	let selectedItem: any = undefined;
	let type = 'row';
	let search = '';
	onMount(async () => {
		getList();
	});
	async function getList() {
		let data = await minio.getObjectList();
		objectList = data.filter((item) => item.Key?.startsWith('Vxml/') && item.Key.endsWith('.bpmn'));
		console.log(objectList);
	}
	function showDeleteModal(item: any) {
		selectedItem = item;
		modal = true;
	}

	async function deleteItem() {
		let bpmn_file = selectedItem.Key;
		let vxml_file = selectedItem.Key.replace('.bpmn', '.vxml');
		await minio.deleteObject(bpmn_file);
		await minio.deleteObject(vxml_file);
		await getList();
		modal = false;
	}

	async function download(item) {
		let data = await minio.getObject(item.key);
	}

	const changeType = () => {
		type == 'grid' ? (type = 'row') : (type = 'grid');
	};

	$: filteredItems = objectList.filter((item) => {
		if (!search) return true;
		return item.Key?.includes(search);
	});
</script>

<svelte:head>
	<title>طراحی فلو دیاگرام</title>
	<meta name="description" content="طراحی فلو دیاگرام" />
</svelte:head>

<div dir="rtl" class="container mx-auto mt-4">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="flex justify-between mb-5">
		<div>
			<span class="text-3xl font-bold"> فایل ها</span>
		</div>
		<div class="flex gap-x-2 items-center">
			<div>
				<i
					on:click={changeType}
					class="la text-3xl text-slate-500 cursor-pointer pt-1"
					class:la-th-list={type == 'grid'}
					class:la-th-large={type == 'row'}
				/>
			</div>
			<div class="relative">
				<input
					class="input input-sm border-slate-200 pr-6"
					type="text"
					placeholder="جستجوی فایل ها"
					bind:value={search}
				/>
				<i class="la la-search text-xl absolute right-1 top-[6px] text-slate-400" />
			</div>
			<div on:click={(e) => goto('editor/create')} class="btn btn-sm btn-primary">
				<i class="la la-plus text-lg" />
				<span>افزودن فایل</span>
			</div>
		</div>
	</div>
	{#if type == 'grid'}
		<div class="grid grid-cols-5 gap-5 pb-4">
			<!-- svelte-ignore a11y-click-events-have-key-events -->

			{#each filteredItems as item}
				<div class="card-item">
					<div class="card-actions bg-white h-14 flex justify-center items-center">
						<span class="font-bold">
							{item.Key?.replace('Vxml/', '').replace('.bpmn', '')}
						</span>
						<a
							class="bg-neutral-200 w-9 h-9 rounded-md flex items-center justify-center absolute left-4"
							href="/editor/{item.Key.replace('Vxml/', '')}"
						>
							<i class="la la-arrow-left" />
						</a>
					</div>
					<div class="card-body py-4 px-6">
						<div class="flex justify-between text-sm mb-3">
							<a
								on:click={showDeleteModal(item)}
								class="flex items-center text-red-700 font-bold cursor-pointer"
							>
								<i class="la la-trash text-2xl" />
								<span class="mr-2">حذف</span>
							</a>
							<div class="divider divider-horizontal" />
							<a
								href="/editor/{item.Key.replace('Vxml/', '')}"
								class="flex items-center text-green-700 font-bold cursor-pointer"
							>
								<i class="la la-edit text-2xl" />
								<span class="mr-2">ویرایش</span>
							</a>
						</div>
						<div class="flex-1" />
						<div class="flex flex-col">
							<div class="flex justify-between font-semibold">
								<span>آخرین ویرایش</span>
								<span>{moment(item.LastModified).format('jDD jMMMM jYYYY')}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col pb-4 gap-y-2">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="grid grid-cols-4 font-bold">
				<div class="px-3">ردیف</div>
				<div class="px-3">نام (سرشماره)</div>
				<div class="px-3">آخرین ویرایش</div>
				<div class="text-left ml-2">ویرایش / حذف</div>
			</div>
			{#each filteredItems as item, key}
				<div class="h-14 bg-white grid grid-cols-4 items-center justify-center">
					<div class="px-3">{key + 1}</div>
					<div class="px-3">
						<span class="font-bold">
							{item.Key?.replace('Vxml/', '').replace('.bpmn', '')}
						</span>
						<!-- <a
							class="bg-neutral-200 w-9 h-9 rounded-md flex items-center justify-center absolute left-4"
							href="/editor/{item.Key.replace('Vxml/', '')}"
						>
							<i class="la la-arrow-left" />
						</a> -->
					</div>
					<div class="px-3">
						<span>{moment(item.LastModified).format('jDD jMMMM jYYYY')}</span>
					</div>
					<div class="text-left ml-4">
						<a
							href="/editor/{item.Key.replace('Vxml/', '')}"
							class=" text-green-700 font-bold cursor-pointer ml-3"
						>
							<i class="la la-edit text-2xl" />
						</a>
						<a on:click={showDeleteModal(item)} class=" text-red-700 font-bold cursor-pointer">
							<i class="la la-trash text-2xl" />
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<!-- <button on:click={(e) => goto('editor/create')} class="btn btn-primary btn-sm"
		>ایجاد فایل جدید</button
	> -->

	<Modal bind:open={modal}>
		<div dir="rtl" class="text-center">
			<div class="flex justify-center">
				<div class="rounded-full bg-red-200 flex justify-center items-center p-2">
					<i class="la la-exclamation-triangle text-3xl text-red-600" />
				</div>
			</div>
			<div class="font-bold mt-2">آیا از انجام این کار مطمئن هستید؟</div>
			<div class="mt-2 text-sm">در صورت تایید این فایل حذف شده و قابل برگشت نمی باشد.</div>
			<div class="mt-6">
				<button on:click={deleteItem} class="btn btn-error"> بله حذف کن</button>
				<button on:click={(e) => (modal = false)} class="btn mr-2">نه منصرف شدم</button>
			</div>
		</div>
	</Modal>
</div>

<style>
	.card-item {
		@apply h-48 card card-bordered border-neutral-200 shadow-md bg-neutral-100 overflow-hidden;
	}
</style>
