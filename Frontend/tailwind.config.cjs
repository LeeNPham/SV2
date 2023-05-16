const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {},
		colors: {
			blue: {
				primary: '#0057AF',
				dark: '#08429f',
				verylight: '#ecfbff',
				accessrequests: '#cdf6ff',
				activity: '#6097b9'
			},
			gray: {
				quickshare: '#f5f9fd',
				groups: '#9baebc',
				verylight: '#f3f7fd'
			},
			cyan: {
				icon: '#00C3E7'
			},
			white: {
				heading: '#f7fdff'
			},
			yellow: {
				recentshares: '#ffebcc'
			},
			red: {
				primary: '#FF0000',
				dark: '#A10500',
				activity: '#FF7777'
			}
		}
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};

module.exports = config;
