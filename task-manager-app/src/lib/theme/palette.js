// @ts-nocheck
/** Matches FrontendOriginal `tailwind.config.cjs` — category + palette tokens */
export const PALETTE = {
	dark: '#041955',
	medium: '#3450a1',
	lightgray: '#97b4ff',
	gray: '#46598c',
	checked: '#183588',
	blueglow: '#1d68df',
	pinkglow: '#eb06ff',
	adamasBlue: '#BCCEFF',
	adamasBlueHover: '#aec3fc'
};

/** Order aligned with original home `categoryColors` / chip rotation */
export const CATEGORY_ACCENT = [
	'#06fffc', // cyan
	'#eb06ff', // pink
	'#1d68df', // blue
	'#29ff06', // green
	'#fffc06', // yellow
	'#ffa406', // orange
	'#a406ff' // purple
];

export function accentAtIndex(i) {
	return CATEGORY_ACCENT[((i % CATEGORY_ACCENT.length) + CATEGORY_ACCENT.length) % CATEGORY_ACCENT.length];
}
