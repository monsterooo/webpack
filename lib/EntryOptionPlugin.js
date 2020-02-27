/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("../declarations/WebpackOptions").Entry} Entry */
/** @typedef {import("../declarations/WebpackOptions").EntryDescription} EntryDescription */
/** @typedef {import("../declarations/WebpackOptions").EntryItem} EntryItem */
/** @typedef {import("../declarations/WebpackOptions").EntryStatic} EntryStatic */
/** @typedef {import("./Compilation").EntryOptions} EntryOptions */
/** @typedef {import("./Compiler")} Compiler */

class EntryOptionPlugin {
	/**
	 * @param {Compiler} compiler the compiler instance one is tapping into
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
			//READ 动态入口entry为一个函数
			if (typeof entry === "function") {
				const DynamicEntryPlugin = require("./DynamicEntryPlugin");
				new DynamicEntryPlugin(context, entry).apply(compiler);
			} else {
				//READ 单入口
				const EntryPlugin = require("./EntryPlugin");
				//READ 处理并添加入口
				EntryOptionPlugin.processEntryStatic(entry, (entry, options) => {
					/**
					 * params => {
					 * 	context: '/Users/createthink/Desktop/git/webpack/debug',
					 * 	entry: './src/index.js',
					 *  options: { name: "main" }
					 * }
					 */
					new EntryPlugin(context, entry, options).apply(compiler);
				});
			}
			return true;
		});
	}

	/**
	 * @param {EntryStatic} entry entry array or single path
	 * @param {function(string, EntryOptions): void} onEntry callback for each entry
	 * @returns {void}
	 */
	static processEntryStatic(entry, onEntry) {
		/**
		 * @param {EntryItem} entry entry array or single path
		 * @param {EntryOptions} options entry options
		 * @returns {void}
		 */
		const applyEntryItemPlugins = (entry, options) => {
			//READ 这里很简单如果entry是字符串就直接调用onEntry回调
			//如果entry是数组则递归调用自身得到字符串的entry再调用onEntry回调
			if (typeof entry === "string") {
				onEntry(entry, options);
			} else if (Array.isArray(entry)) {
				for (const item of entry) {
					applyEntryItemPlugins(item, options);
				}
			}
		};

		/**
		 * @param {EntryDescription} entry entry array or single path
		 * @param {EntryOptions} options entry options
		 * @returns {void}
		 */
		const applyEntryDescriptionPlugins = (entry, options) => {
			applyEntryItemPlugins(entry.import, options);
		};

		//READ 如果入口是字符串或者一个数组
		if (typeof entry === "string" || Array.isArray(entry)) {
			//READ 如果是单入口则自动添加name为`main`并且应用入口插件
			applyEntryItemPlugins(entry, { name: "main" }); // entry => ./src/index.js
		} else if (entry && typeof entry === "object") {
			for (const name of Object.keys(entry)) {
				const value = entry[name];
				if (typeof value === "string" || Array.isArray(value)) {
					applyEntryItemPlugins(value, { name });
				} else {
					applyEntryDescriptionPlugins(value, { name });
				}
			}
		}
	}
}

module.exports = EntryOptionPlugin;
