<script lang="ts">
	import { onMount } from 'svelte';
	import { minio } from '$lib/stores/minio';
	import type { _Object } from '@aws-sdk/client-s3';
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import { replace } from 'tiny-svg';
	let modal = false;
	let objectList: _Object[] = [];
	let selectedItem: any = undefined;
	onMount(async () => {
		getList();
	});
	async function getList() {
		let data = await minio.getObjectList();
		objectList = data.filter((item) => item.Key?.startsWith('VXML/'));
	}
	function showDeleteModal(item: any) {
		selectedItem = item;
		modal = true;
	}

	async function deleteItem() {
		await minio.deleteObject(selectedItem.Key);
		await getList();
		modal = false;
	}
</script>

<svelte:head>
	<title>طراحی فلو دیاگرام</title>
	<meta name="description" content="طراحی فلو دیاگرام" />
</svelte:head>

<div class="container mx-auto mt-20">
	{#each objectList as item}
		<div class="mb-2">
			<a class="hover:text-primary-focus" href="/editor/{item.Key.replace('VXML/', '')}">
				{item.Key?.replace('VXML/', '').replace('.bpmn', '')}
				<i class="la la-edit" />
			</a>
			<a on:click={showDeleteModal(item)} class="hover:text-error cursor-pointer"
				><i class="la la-trash text-red-600" /></a
			>
		</div>
	{/each}
	<button on:click={(e) => goto('editor/create')} class="btn btn-primary btn-sm"
		>ایجاد فایل جدید</button
	>

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
