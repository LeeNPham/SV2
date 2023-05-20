const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			colors: {
				category: {
					pink: '#eb06ff',
					blue: '#1d68df',
					green: '#29ff06',
					cyan: '#06fffc',
					yellow: '#fffc06',
					orange: '#ffa406',
					purple: '#a406ff'
				},
				palette: {
					dark: '#041955',
					medium: '#3450a1',
					pinkglow: '#eb06ff',
					blueglow: '#1d68df',
					checked: '#183588',
					gray: '#46598c',
					lightgray: '#97b4ff'
				}
			}
		}
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};

module.exports = config;
