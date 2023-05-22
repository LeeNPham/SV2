<script>
	import { goto } from '$app/navigation'

	export let name = 'Lee'
	function goHome() {
		goto('/')
	}
</script>

<div class="min-w-[414px] flex justify-center">
	<div class="text-white">This is {name}'s profile</div>
</div>

<button type="button" on:click={goHome}> Home </button>
