<script>
	export let message = '';
	export let type = '';
	export let show = false;
	export let timeout = 5000;

	$: show,
		show &&
			setTimeout(() => {
				show = false;
			}, timeout);
</script>

{#if show}
	<div class="toast toast-center">
		<div
			class="alert items-start"
			class:alert-success={type == 'success'}
			class:alert-error={type == 'error'}
		>
			<span class="text-sm pr-0">{message}</span>
			{#if type == 'success'}
				<i class="la la-check-circle" />
			{/if}
			{#if type == 'error'}
				<i class="la la-exclamation-triangle" />
			{/if}
		</div>
	</div>
{/if}
