// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeObsidian from 'starlight-theme-obsidian'
import starlightObsidian, { obsidianSidebarGroup } from 'starlight-obsidian'

// https://astro.build/config
export default defineConfig({
	site: 'https://commonbook.davidamoswrites.club',
	integrations: [
		starlight({
			title: 'David\'s Commonbook',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/somacdivad/commonbook-website' }],
			plugins: [
				// Generate the Obsidian vault pages.
				starlightObsidian({
					vault: './src/vault',
					output: 'notes',
					sidebar: { collapsed: false, collapsedFolders: true },
				}),
				starlightThemeObsidian(),
			],
			sidebar: [
				{
					slug: 'how-to-use',
				},
				obsidianSidebarGroup,
			],
		}),
	],
});
