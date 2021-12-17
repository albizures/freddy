/// <reference types="chrome"/>

import './app.css';
import App from './App.svelte';

const ID = '__FREDDY__';

export const create = () => {
	const appElement = document.getElementById(ID);

	if (!appElement) {
		const link = document.createElement('link');
		link.rel = chrome.runtime.getURL('build/bundle.css');
		(document.head || document.documentElement).appendChild(link);

		const app = new App({
			target: document.body,
			props: {},
		});
	}
};

create();
