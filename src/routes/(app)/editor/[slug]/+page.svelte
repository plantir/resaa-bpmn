<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import Bpmn from '$lib/components/bpmn/utils/BPMN.svelte';
	import SidePanel from '$lib/components/SidePanel/SidePanel.svelte';
	import Toast from '$lib/components/Toast/Toast.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
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
		await minio.putObject('VXML/' + $page.params.slug, xml);
		toastCondition = true;
	}
	async function importVXML() {
		await bpmn.importVXML();
	}
	async function createNew() {
		goto('/editor/create');
	}
	import { minio } from '$lib/stores/minio';
	import { page } from '$app/stores';
	onMount(async () => {
		document.onkeydown = function (e) {
			if (e.ctrlKey && e.key === 's') {
				e.preventDefault();
				save();
			}
		};
		let slug = $page.params.slug;
		let data = await minio.getObject('VXML/' + slug);
		let bpmn_data = await data.Body?.transformToString();
		if (slug.includes('.bpmn')) {
			bpmn.load(bpmn_data);
		} else if (slug.includes('.xml')) {
			bpmn.loadVxml(bpmn_data);
		}
	});
</script>

<svelte:head>
	<title>BPMN</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<Header on:download={download} on:save={save} on:importVxml={importVXML} on:createNew={createNew} />
<Bpmn on:setting:clicked={onSettingClicked} bind:this={bpmn} />
<SidePanel bind:open data={nodeData} on:submit={onSubmit} />
<Toast type="success" timeout={2000} bind:show={toastCondition} message={toastMessage} />
