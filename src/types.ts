export enum MessageTypes {
	SET_TABS,
	CHANGE_TAB,
	NEW_TAB,
	CLOSE_TAB,
	MUTE_TAB,
}

export type Message =
	| {
			from: '__FREDDY__BG';
			type: MessageTypes.SET_TABS;
			payload: chrome.tabs.Tab[];
	  }
	| {
			from: '__FREDDY__CONTENT';
			type: MessageTypes.SET_TABS;
	  }
	| {
			from: '__FREDDY__CONTENT';
			type: MessageTypes.CHANGE_TAB;
			payload: number;
	  }
	| {
			from: '__FREDDY__CONTENT';
			type: MessageTypes.NEW_TAB;
			payload: {
				url?: string;
				active?: boolean;
			};
	  }
	| {
			from: '__FREDDY__CONTENT';
			type: MessageTypes.CLOSE_TAB;
			payload?: number;
	  }
	| {
			from: '__FREDDY__CONTENT';
			type: MessageTypes.MUTE_TAB;
			payload?: number;
	  };

export enum Modes {
	Tab = '',
	Command = '>',
	Search = '?',
}

export interface ActionResult {
	isOpen?: boolean;
	value?: string;
	options?: Option[];
}

export interface Option {
	label: string;
	icon?: string;
	action: (
		value: string,
	) => void | ActionResult | Promise<ActionResult>;
}

export type TargetEvent<Event, Target> = Event & {
	currentTarget: Target;
	target: Target;
};
