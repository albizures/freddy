import { Modes, Option } from './types';
import {
	getTabs,
	muteTab,
	changeTab,
	openTab,
	closeTab,
} from './messages';

export const tabsToOptions = (tabs: chrome.tabs.Tab[]) => {
	return tabs.map((tab) => {
		return {
			label: tab.title,
			icon: tab.favIconUrl,
			action: () => {
				changeTab(tab.id);
			},
		};
	});
};

const createSearchEngineOption = (
	label: string,
	baseUrl: string,
) => ({
	label,
	action: (value: string) => {
		if (value.trim() === '?') {
			return {
				isOpen: true,
			};
		}

		const query = encodeURIComponent(value.replace('?', '').trim());
		openTab({
			url: `${baseUrl}${query}`,
		});
	},
});

export const searchEngines: Option[] = [
	createSearchEngineOption(
		'Google',
		'https://www.google.com/search?q=',
	),
	createSearchEngineOption(
		'Youtube',
		'https://www.youtube.com/results?search_query=',
	),
	createSearchEngineOption('NPM', 'https://www.npmjs.com/search?q='),
];

export const commnads: Option[] = [
	{
		label: 'Tabs: Reload Tab',
		action: () => {
			window.location.reload();
		},
	},
	{
		label: 'Tabs: Close Tab',
		action: () => {
			closeTab();
		},
	},
	{
		label: 'Tabs: New Tab',
		action: () => {
			openTab();
		},
	},
	{
		label: 'Tabs: Mute Tab',
		action: () => {
			muteTab();
		},
	},
	{
		label: 'Tabs: Change Tab',
		action: async () => {
			return {
				value: Modes.Tab,
				isOpen: true,
				options: tabsToOptions(await getTabs()),
			};
		},
	},
	{
		label: 'Search',
		action: () => {
			return {
				value: Modes.Search,
				isOpen: true,
				options: searchEngines,
			};
		},
	},
];
