
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
					DEFAULT: '#f5fff8',
					100: '#00641e',
					200: '#00c83c',
					300: '#2dff6c',
					400: '#91ffb2',
					500: '#f5fff8',
					600: '#f7fff9',
					700: '#f9fffb',
					800: '#fbfffc',
					900: '#fdfffe'
				},
				mint_green: {
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
				sage: {
					DEFAULT: '#d5e6e0',
					100: '#213730',
					200: '#436f5f',
					300: '#67a48e',
					400: '#9ec5b7',
					500: '#d5e6e0',
					600: '#deebe6',
					700: '#e6f0ed',
					800: '#eef5f3',
					900: '#f7faf9'
				},
				paynes_gray: {
					DEFAULT: '#477086',
					100: '#0e161b',
					200: '#1c2d35',
					300: '#2a4350',
					400: '#38596b',
					500: '#477086',
					600: '#5f90ab',
					700: '#87acc0',
					800: '#afc7d5',
					900: '#d7e3ea'
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
