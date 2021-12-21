<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { Modes, Option } from './types';
	import { commnads, searchEngines, tabsToOptions } from './options';
	import { getTabs } from './messages';

	let options: Option[] = [];
	let input: HTMLInputElement;
	let value = '';
	let isOpen = false;
	let focusIndex = 0;

	const setCommnadMode = () => {
		value = Modes.Command;
		options = commnads;
		focusIndex = 0;
	};

	const setTabMode = async () => {
		value = Modes.Tab;
		options = tabsToOptions(await getTabs());
		focusIndex = 0;
	};

	const setSearchMode = () => {
		value = Modes.Search;
		options = searchEngines;
		focusIndex = 0;
	};

	const close = () => {
		focusIndex = 0;
		isOpen = false;
	};

	document.body.addEventListener('keydown', (event) => {
		switch (event.key) {
			case 'p':
				if (event.metaKey) {
					event.preventDefault();

					if (event.shiftKey) {
						setCommnadMode();
					} else {
						setTabMode();
					}

					isOpen = true;
				}
				break;

			case 'ArrowUp':
				if (!isOpen) return;
				event.preventDefault();

				focusIndex -= 1;
				if (focusIndex < 0) {
					focusIndex = options.length - 1;
				}
				break;
			case 'ArrowDown':
				if (!isOpen) return;
				event.preventDefault();
				focusIndex = (focusIndex + 1) % options.length;
				break;
			case 'Enter':
				if (!isOpen) return;
				event.preventDefault();

				runOptionAction(focusIndex);
				break;
			case 'Escape':
				if (!isOpen) return;
				event.preventDefault();
				close();
				break;
			default:
				break;
		}
	});

	const runOptionAction = async (index: number) => {
		const result = await options[index].action(value);

		if (result) {
			isOpen = Boolean(result.isOpen);
			if (result.value !== undefined) {
				value = result.value;
			}

			if (result.options !== undefined) {
				options = result.options;
			}
		} else {
			// by default close after an action
			isOpen = false;
		}
	};

	$: {
		const val = value.trim();
		if (isOpen) {
			switch (val) {
				case Modes.Command:
					setCommnadMode();
					break;
				case Modes.Search:
					setSearchMode();
					break;
				case Modes.Tab:
					setTabMode();
					break;
			}
		}
	}

	const onVisibilityChange = () => {
		if (document.visibilityState === 'hidden') {
			isOpen = false;
		}
	};

	onMount(() => {
		document.addEventListener('visibilitychange', onVisibilityChange);
	});

	afterUpdate(() => {
		if (isOpen) {
			input.focus();
		}
	});
</script>

<div
	id="__FREDDY__"
	class="fixed inset-0"
	on:click|self={close}
	class:hidden={!isOpen}
>
	<div
		class="max-w-screen-sm mx-auto shadow-xl border border-gray-300rounded-sm mt-6 flex flex-col bg-white"
	>
		<input bind:this={input} bind:value type="text" />
		<ul class="list-none m-0">
			{#each options as option, index (index)}
				<li class="" class:bg-red-100={focusIndex === index}>
					<button class="" on:click={() => runOptionAction(index)}>
						{#if option.icon}
							<img
								class="w-5 h-5 inline-block align-sub"
								src={option.icon}
								alt={option.label}
							/>
						{/if}
						{option.label}</button
					>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style lang="postcss">
	#__FREDDY__ {
		z-index: 999999 !important;

		@apply backdrop-blur-sm;
	}

	#__FREDDY__ ul li {
		@apply text-base px-1 m-0 leading-normal tracking-normal font-sans;
	}

	#__FREDDY__ ul li button {
		@apply block w-full px-2 py-1 overflow-hidden;
		@apply text-base text-left whitespace-nowrap tracking-normal text-ellipsis text-black;
	}

	#__FREDDY__ ul li:hover {
		@apply bg-gray-100;
	}

	#__FREDDY__ input {
		@apply block flex-1 m-1 p-1 bg-white;
		@apply font-sans text-base tracking-normal leading-normal text-black;
	}

	#__FREDDY__ input:active,
	#__FREDDY__ input:focus {
		outline: solid 1px #2563eb !important;
	}
</style>
