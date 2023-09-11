/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{svelte,html,js}'],
	theme: {
		extend: {
			fontFamily: {
				Vazirmatn: 'Vazirmatn'
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		styled: true,
		themes: true,
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
		darkTheme: 'light'
	}
};
