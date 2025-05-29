
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				mint_cream: {
					DEFAULT: '#edf8f1',
					100: '#1b462b',
					200: '#368c56',
					300: '#61c284',
					400: '#a7ddbb',
					500: '#edf8f1',
					600: '#f0f9f4',
					700: '#f4fbf6',
					800: '#f8fcf9',
					900: '#fbfefc'
				},
				beige: {
					DEFAULT: '#dfe6d5',
					100: '#2e3721',
					200: '#5c6f43',
					300: '#8aa467',
					400: '#b5c59e',
					500: '#dfe6d5',
					600: '#e6ebde',
					700: '#ecf0e6',
					800: '#f2f5ee',
					900: '#f9faf7'
				},
				sky_blue: {
					DEFAULT: '#85b8cc',
					100: '#14282f',
					200: '#284f5f',
					300: '#3c778e',
					400: '#559cb8',
					500: '#85b8cc',
					600: '#9dc6d6',
					700: '#b6d4e0',
					800: '#cee2eb',
					900: '#e7f1f5'
				},
				paynes_gray: {
					DEFAULT: '#4b5f7b',
					100: '#0f1319',
					200: '#1e2631',
					300: '#2d394a',
					400: '#3c4c63',
					500: '#4b5f7b',
					600: '#657ea0',
					700: '#8b9eb8',
					800: '#b2bed0',
					900: '#d8dfe7'
				},
				naples_yellow: {
					DEFAULT: '#efcb68',
					100: '#3e2f06',
					200: '#7c5e0d',
					300: '#ba8d13',
					400: '#e9b529',
					500: '#efcb68',
					600: '#f2d585',
					700: '#f5e0a4',
					800: '#f9eac2',
					900: '#fcf5e1'
				},
				rich_black: {
					DEFAULT: '#000411',
					100: '#000103',
					200: '#000106',
					300: '#000209',
					400: '#00030c',
					500: '#000411',
					600: '#001b72',
					700: '#0032d5',
					800: '#3967ff',
					900: '#9cb3ff'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
