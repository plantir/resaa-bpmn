<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import Bpmn from '$lib/components/bpmn/utils/BPMN.svelte';
	import SidePanel from '$lib/components/SidePanel/SidePanel.svelte';
	import Toast from '$lib/components/Toast/Toast.svelte';
	import { minio } from '$lib/stores/minio';
	import { onMount } from 'svelte';
	let open = false;
	let nodeData: any = {};
	let bpmn: any = {};
	let toastMessage = 'با موفقیت ذخیره شد';
	let toastCondition = false;
	onMount(() => {
		document.onkeydown = function (e) {
			if (e.ctrlKey && e.key === 's') {
				e.preventDefault();
				save();
			}
		};
	});
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
		let vxml = await bpmn.xml(true);
		let name = Date.now().toString();
		await minio.putObject('Vxml/' + name + '.bpmn', xml);
		await minio.putObject('Vxml/' + name + '.vxml', vxml);
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
