// @ts-check
import { defineConfig } from 'astro/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import starlight from '@astrojs/starlight';
import starlightThemeObsidian from 'starlight-theme-obsidian'
import starlightObsidian, { obsidianSidebarGroup } from 'starlight-obsidian'
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Only alias Node built-ins for the browser.
 * Astro's `astro sync` loads config in an SSR ESM context where some CJS polyfills
 * (like `path-browserify`) can throw `module is not defined`.
 */
function browserOnlyNodeBuiltins() {
	/** @type {import('vite').Plugin} */
	const plugin = {
		name: 'browser-only-node-builtins',
		enforce: 'pre',
		async resolveId(source, importer, options) {
			// Only rewrite for client-side (non-SSR) requests.
			if (options?.ssr) return null;
			if (source === 'path' || source === 'node:path') {
				return this.resolve('path-browserify', importer, { skipSelf: true });
			}
			return null;
		},
	};
	return plugin;
}

/**
 * Vite pre-bundles deps (like micromatch) with esbuild.
 * That step does NOT reliably go through Vite `resolveId`, so we also need an
 * esbuild-only alias to make sure `require('path')` becomes `path-browserify` in
 * the optimized browser deps.
 */
function optimizeDepsPathPolyfill() {
	const pathBrowserifyEntry = require.resolve('path-browserify');

	/** @type {import('esbuild').Plugin} */
	const plugin = {
		name: 'optimize-deps-path-polyfill',
		setup(build) {
			build.onResolve({ filter: /^(node:)?path$/ }, () => {
				return { path: pathBrowserifyEntry };
			});
		},
	};
	return plugin;
}

// https://astro.build/config
export default defineConfig({
	site: 'https://commonbook.davidamoswrites.club',
	vite: {
		plugins: [
			browserOnlyNodeBuiltins(),
			nodePolyfills({
				include: ['process', 'buffer'],
				globals: {
					Buffer: true,
					process: true,
					global: true,
				},
			}),
		],
		optimizeDeps: {
			esbuildOptions: {
				plugins: [optimizeDepsPathPolyfill()],
			},
		},
	},
	integrations: [
		starlight({
			title: 'david amos',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/somacdivad/commonbook-website' }],
			customCss: [
				// Relative path to your custom CSS file
				'./src/styles/custom.css',
				'@fontsource-variable/caveat',
				'@fontsource-variable/inter',
			],
			plugins: [
				// Generate the Obsidian vault pages.
				starlightObsidian({
					vault: './src/vault',
					output: 'notes',
					sidebar: { collapsed: false, collapsedFolders: true },
				}),
				starlightThemeObsidian({
					graph: true,
					sitemapConfig: {
						pageInclusionRules: ['src/content/docs/notes/**/*'],
					},
					graphConfig: {
						depth: 3,
						tagRenderMode: 'node',
						nodeCurrentStyle: {
							shapeSize: 8,
						},
					},
				}),
			],
			sidebar: [
				{
					label: 'Start Here',
					autogenerate: { directory: 'start-here' },
				},
				obsidianSidebarGroup,
			],
		}),
	],
});
