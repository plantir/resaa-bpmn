<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Bpmn from '$lib/components/bpmn/utils/BPMN.svelte';
	import { IranTell } from '$lib/components/bpmn/utils/convertor';
	import Header from '$lib/components/Header/Header.svelte';
	import SidePanel from '$lib/components/SidePanel/SidePanel.svelte';
	import Toast from '$lib/components/Toast/Toast.svelte';
	import { minio } from '$lib/stores/minio';
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
		let vxml = await bpmn.xml(true);
		let [full, name] =
			/<meta name="Meta\.IVRStartNodeTitle" content="([0-9]+)"\/>/gm.exec(vxml) || [];
		if (!name) {
			toastMessage = 'حتما باید یک ماجول شماره در صفحه باشد و مقدار داشته باشد';
			toastCondition = true;
			return;
		}
		name = IranTell(name);
		await minio.putObject('Vxml/' + name + '.bpmn', xml);
		await minio.putObject('Vxml/' + name.replace('_', '') + '.vxml', vxml);
		let slug = $page.params.slug;
		let bpmn_file = `Vxml/${slug}`;
		let vxml_file = bpmn_file.replace('.bpmn', '.vxml');
		if (name != slug.replace('.bpmn', '')) {
			await minio.deleteObject(bpmn_file);
			await minio.deleteObject(vxml_file);
			setTimeout(() => {
				goto(`/editor/${name}.bpmn`);
			}, 100);
		}
		toastCondition = true;
	}
	async function importVXML() {
		await bpmn.importVXML();
	}
	async function createNew() {
		goto('/editor/create');
	}

	onMount(async () => {
		document.onkeydown = function (e) {
			if (e.ctrlKey && e.key === 's') {
				e.preventDefault();
				save();
			}
		};
		let slug = $page.params.slug;
		let data = await minio.getObject('Vxml/' + slug);
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
