/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const ModuleDependency = require("./ModuleDependency");

class EntryDependency extends ModuleDependency {
	/**
	 * @param {string} request request path for entry
	 */
	//READ request => "./src/index.js"
	constructor(request) {
		super(request);
	}

	get type() {
		return "entry";
	}
}

module.exports = EntryDependency;
