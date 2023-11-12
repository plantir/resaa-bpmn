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
		themes: [ {light: {
			...require("daisyui/src/theming/themes")["[data-theme=light]"],
			"primary": "#00425B",
			"primary-content": "#ffffff",
			"primary-focus": "#03739d",
			"secondary":"#56C5D0"

		  }}],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
		darkTheme: false,
		
	}
};
