<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import Bpmn from '$lib/components/bpmn/utils/BPMN.svelte';
	import SidePanel from '$lib/components/SidePanel/SidePanel.svelte';
	import Toast from '$lib/components/Toast/Toast.svelte';
	import { minio } from '$lib/stores/minio';
	let open = false;
	let nodeData: any = {};
	let bpmn: any = {};
	let toastMessage = 'با موفقیت ذخیره شد';
	let toastCondition = false;
	function onSettingClicked(data: any) {
		open = false;
		setTimeout(() => {
			open = true;
			nodeData = data.detail;
		}, 1);
	}
	function onSubmit(data: any) {
		bpmn.updateNode(nodeData.element, data.detail);
		open = false;
		toastCondition = true;
	}

	function download() {
		bpmn.download();
	}
	async function save() {
		let xml = await bpmn.xml();
		console.log(xml);
		await minio.putObject(Date.now().toString() + '.bpmn', xml);
		toastCondition = true;
	}
	async function importVXML() {
		await bpmn.importVXML();
	}
	async function createNew() {
		await bpmn.createNew();
	}
</script>

<svelte:head>
	<title>BPMN</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<Header on:download={download} on:save={save} on:importVxml={importVXML} on:createNew={createNew} />
<Bpmn on:setting:clicked={onSettingClicked} bind:this={bpmn} />
<SidePanel bind:open data={nodeData} on:submit={onSubmit} />
<Toast type="success" timeout={2000} bind:show={toastCondition} message={toastMessage} />

<style>
</style>
