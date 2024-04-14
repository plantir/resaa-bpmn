<script lang="ts">
	import { minio } from '$lib/stores/minio';
	export let file: any;
	let files: any = [];
	let id = new Date().getTime().toString();
	let src: any = null;
	let loading = false;
	const loadFile = async () => {
		if (typeof file == 'string' && file != '') {
			loading = true;
			let data = await minio.getObject(
				file.replace('http://document-server.cloudpbx.local:5000/Documents/', '')
			);
			let body_byte: any = await data.Body!.transformToByteArray();
			let blob = new Blob([body_byte]);
			src = URL.createObjectURL(blob);
			loading = false;
		}
	};
	const onUploadFile = async (e) => {
		src = null;
		file = e.target.files[0];
	};
	$: file, loadFile();
</script>

<div class="">
	<input {id} on:input={onUploadFile} type="file" bind:files accept=".mp3" class="hidden" />
	<label class="btn btn-outline btn-primary" for={id}>
		آپلود صدا <icon class="la la-cloud-upload-alt text-2xl" /></label
	>
	{#if loading}
		<div class="mt-2 flex justify-center">
			<span class="loading loading-spinner text-primary" />
		</div>
	{/if}
	{#if src}
		<div class="mt-2">
			<audio {src} controls />
		</div>
	{/if}
	{#if files.length}
		{@const uploaded_file = files[0]}
		<div class="mt-2">
			<audio src={URL.createObjectURL(uploaded_file)} controls />
		</div>
	{/if}
</div>
