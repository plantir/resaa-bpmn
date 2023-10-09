<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import Bpmn from '$lib/components/bpmn/utils/BPMN.svelte';
	import SidePanel from '$lib/components/SidePanel/SidePanel.svelte';
	import Toast from '$lib/components/Toast/Toast.svelte';
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
		await bpmn.save();
		toastCondition = true;
	}
</script>

<svelte:head>
	<title>BPMN</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<Header on:download={download} on:save={save} />
<Bpmn on:setting:clicked={onSettingClicked} bind:this={bpmn} />
<SidePanel bind:open data={nodeData} on:submit={onSubmit} />
<Toast type="success" timeout={2000} bind:show={toastCondition} message={toastMessage} />

<style>
</style>
