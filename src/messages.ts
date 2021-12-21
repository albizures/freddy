import { Message, MessageTypes } from './types';

export const getTabs = (): Promise<chrome.tabs.Tab[]> =>
	new Promise((resolve) => {
		const onEvent = (message: Message) => {
			if (
				message.from !== '__FREDDY__BG' ||
				message.type !== MessageTypes.SET_TABS
			)
				return;
			resolve(message.payload);
			chrome.runtime.onMessage.removeListener(onEvent);
		};

		chrome.runtime.onMessage.addListener(onEvent);

		chrome.runtime.sendMessage<Message>({
			from: '__FREDDY__CONTENT',
			type: MessageTypes.SET_TABS,
		});
	});

export const changeTab = (id: number) => {
	chrome.runtime.sendMessage<Message>({
		from: '__FREDDY__CONTENT',
		type: MessageTypes.CHANGE_TAB,
		payload: id,
	});
};

export const openTab = (payload?: {
	url?: string;
	active?: boolean;
}) => {
	chrome.runtime.sendMessage<Message>({
		from: '__FREDDY__CONTENT',
		type: MessageTypes.NEW_TAB,
		payload,
	});
};

export const closeTab = (id?: number) => {
	chrome.runtime.sendMessage<Message>({
		from: '__FREDDY__CONTENT',
		type: MessageTypes.CLOSE_TAB,
		payload: id,
	});
};

export const muteTab = (id?: number) => {
	chrome.runtime.sendMessage<Message>({
		from: '__FREDDY__CONTENT',
		type: MessageTypes.MUTE_TAB,
		payload: id,
	});
};
