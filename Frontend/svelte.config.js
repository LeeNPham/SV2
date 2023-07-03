import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$store: path.resolve('./src/stores'),
			$lib: path.resolve('./src/lib'),
			$src: path.resolve('./src')
		}
		// csp: {
		//     directives: {
		//         'script-src': ['self']
		//     },
		//     reportOnly: {
		//         'script-src': ['self']
		//     }
		// }
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]

	// Enable svelte inspector.
	// vitePlugin: {
	// 	inspector: true
	// }
}

export default config
