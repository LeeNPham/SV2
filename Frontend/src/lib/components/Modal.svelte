<script lang="ts">
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	export let showModal: any; // boolean
	export let Title: any;
	let dialog: any; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	class="bg-palette-lightgray"
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div on:click|stopPropagation>
		<div class="flex flex-row justify-center pb-2">
			<div class="text-center text-3xl font-bold text-palette-dark">{Title}</div>
			<!-- svelte-ignore a11y-autofocus -->
			<button
				class="absolute top-3 right-5 text-palette-dark"
				autofocus
				on:click={() => dialog.close()}
			>
				<CloseIcon />
			</button>
		</div>
		<hr class="border-palette-dark mb-3" />
		<slot />
		<hr class="border-palette-dark mt-3" />
	</div>
</dialog>

<style>
	dialog {
		max-width: 40em;
		border-radius: 1em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
