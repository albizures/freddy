/// <reference types="chrome"/>
import { MessageTypes, Message } from './types';

export const getTabs = async () => {
	return chrome.tabs.query({});
};

function assertUnreachable(x: never): never {
	throw new Error("Didn't expect to get here");
}

chrome.runtime.onMessage.addListener(
	(message: Message, sender, sendResponse) => {
		sendResponse({});

		if (message.from !== '__FREDDY__CONTENT') {
			return;
		}

		switch (message.type) {
			case MessageTypes.SET_TABS:
				getTabs().then((tabs) => {
					chrome.tabs.sendMessage<Message>(sender.tab.id, {
						from: '__FREDDY__BG',
						type: MessageTypes.SET_TABS,
						payload: tabs,
					});
				});
				break;
			case MessageTypes.CHANGE_TAB:
				chrome.tabs.update(message.payload, {
					active: true,
				});
				break;
			case MessageTypes.NEW_TAB:
				chrome.tabs.create({ active: true, ...message.payload });
				break;
			case MessageTypes.CLOSE_TAB:
				console.log('checking');

				if (typeof message.payload === 'number') {
					chrome.tabs.remove(message.payload);
				} else {
					chrome.tabs.query({ active: true }, (tabs) => {
						const [tab] = tabs;
						if (tab) {
							chrome.tabs.remove(tab.id);
						}
					});
				}
				break;
			case MessageTypes.MUTE_TAB:
				if (typeof message.payload === 'number') {
					chrome.tabs.update(message.payload, { muted: true });
				} else {
					chrome.tabs.query({ active: true }, (tabs) => {
						const [tab] = tabs;
						if (tab) {
							chrome.tabs.update(tab.id, { muted: true });
						}
					});
				}
				break;
			default:
				assertUnreachable(message);
		}
	},
);
