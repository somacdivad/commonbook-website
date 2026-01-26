// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightObsidian, { obsidianSidebarGroup } from 'starlight-obsidian'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'David Amos\'s Commonbook',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			plugins: [
				// Generate the Obsidian vault pages.
				starlightObsidian({
					vault: './src/vault',
					output: 'notes',
					sidebar: { collapsed: false, collapsedFolders: true },
				}),
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
