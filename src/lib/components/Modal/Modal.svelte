<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	export let open = false;
	// export let size: 'small' | 'large' | 'fullScreen' = "small";
	export const actions: any = [
		{ text: 'Cancel', variant: '', onClick: () => close() },
		{ text: 'Ok', variant: '', onClick: () => close() }
	];

	export const title: string | undefined = undefined;
	export let onClose: Function = () => {};
	function close() {
		open = false;
		onClose && onClose();
	}
	function openModal() {
		open = true;
	}

	let openCTX = writable({ open });
	setContext('modalOpen', openCTX);
	openCTX.subscribe((o) => {
		if (!o.open) {
			close();
		}
	});
	let dialog = undefined;
</script>

<div class="modal" bind:this={dialog} class:open>
	<div
		on:click={(e) => {
			e.stopPropagation();
		}}
		class="modal-box z-10"
	>
		<slot />
	</div>
	{#if open}
		<div class="backdrop" on:click={close} />
	{/if}
</div>

<!-- <div class="modal">
  {#if open}
    {title}
    <Button size="micro" on:click={close}>
      <Icon class="Polaris-Icon" name="CancelMajor" />
    </Button>
    <slot />
    <slot name="actions">
      {#each actions as action}
        <Button
          on:click={() => {
            close();
            action.onClick && action.onClick();
          }}
          variant={action.variant}
        >
          {action.text}
        </Button>
      {/each}
    </slot>
  {/if}
</div> -->

<style>
	/* .modal {
		position: fixed;
		top: 0px;
		left: 0px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
		pointer-events: all;
		z-index: 0;
		opacity: 1;
	}
	.modal-content {
		width: 100%;
		max-width: 855px;
		min-height: 150px;
		background-color: white;
		position: relative;
		z-index: 13;
		max-height: 90vh;
		overflow-y: auto;
		padding: 0.5rem;
		border-radius: 0.5rem;
	} */
	.backdrop {
		opacity: 0.2;
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 8;
		background-color: gray;
	}
	.open {
		pointer-events: auto;
		visibility: visible;
		opacity: 1;
	}
	/* .hidden {
		display: none;
	} */
</style>
