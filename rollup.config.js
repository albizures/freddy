import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;

function extension() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('yarn', ['ext:start'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true,
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		},
	};
}

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn(
				'yarn',
				['start', '--dev'],
				{
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true,
				},
			);

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		},
	};
}

const ui = {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'ui',
		file: 'public/build/bundle.js',
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		// css({ output: 'bundle.css' }),
		postcss({
			extract: 'bundle.css',
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production,
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		!production && extension(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		// !production &&
		// livereload({
		// watch: 'public',
		// clientUrl: 'http://0.0.0.0:35729/livereload.js?snipver=1',
		// }),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};

const background = {
	input: 'src/background.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'background',
		file: 'public/build/background.js',
	},
	plugins: [
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production,
		}),
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};

export default [ui, background];
