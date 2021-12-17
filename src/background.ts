/// <reference types="chrome"/>
import { MessageTypes, Message } from './types';

export const getTabs = async () => {
	return chrome.tabs.query({});
};

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
			default:
				break;
		}
	},
);
