<script lang="ts">
	export let value: any;
	export let placeholder: string;
	export let items: any[];
	let key = 0;
	const changeKey = () => {
		key++;
	};
	$: items, changeKey();
</script>

{#key key}
	<select bind:value class="select select-bordered w-full max-w-xs">
		{#if placeholder}
			<option disabled selected>{placeholder}</option>
		{/if}
		{#each items as item}
			<option value={item.value}>{item.text}</option>
		{/each}
	</select>
{/key}
