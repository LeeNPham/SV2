<script>
	import '../app.postcss';
</script>

<div class="app grid grid-cols-1 w-full min-h-screen content-center bg-palette-dark">
	<main class="w-full h-full flex justify-center">
		<div class="max-w-[414px] h-[896px] flex flex-col justify-center">
			<slot />
		</div>
	</main>
</div>
