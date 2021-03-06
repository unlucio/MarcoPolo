/**
 * Oriend DB REST Driver for node.js
 *
 * Examples:
 *
 *     var orientDB = new RestInterface();
 *
 * @options {Object}
 * @api public
 */

"use strict";

var HttpClient = require('./httpClient'),
	util = require('util');

var modulesList = [
	require("./commands/database"),
	require("./commands/class"),
	require("./commands/document"),
	require("./commands/cluster"),
	require("./commands/command"),
	require("./commands/query"),
	require("./commands/server"),
	require("./commands/batch")
];

function importModules(modulesLIst, target) {
	for (var moduleIndex in modulesList) {
		var selectedModule = modulesList[moduleIndex];
		for (var methodName in selectedModule) {
			var method = selectedModule[methodName];
			target[methodName] = method;
		}
	}
}

// default values
var def_host = "localhost";
var def_port = 2480;
var def_root_password = 'pippo';

var def_db_name = "scrap";
var def_db_type = "graph";
var def_db_user = {
	userName: "admin",
	password: "admin"
};

module.exports = (function (RestInterface) {

	RestInterface = function (options) {
		options = options || {};
		options.server = options.server || {};
		options.database = options.database || {};

		this.confData = {
			server: {
				host: options.server.host || def_host,
				port: options.server.port || def_port,
				rootPassword: options.server.rootPassword || def_root_password
			},
			database: {
				name: options.database.name || def_db_name,
				dbUser: options.database.user || def_db_user,
				type: options.database.type || def_db_type,
			}
		};
	};

	RestInterface.prototype = {
		evalFetchPlan: function (planDettails) {
			var planString = '';
			switch (typeof planDettails) {
			case 'string':
				switch (planDettails) {
				case 'deep':
					planString = "*:-1";
					break;
				case 'medium':
					planString = "*:1";
					break;
				case 'shallow':
					planString = "*:0";
					break;
				default:
					planString = planDettails.replace(/\ /g, "%20");
					break;
				}
				break;
			case 'number':
				planString = "*:" + planDettails;
				break;
			case 'object':
				if (util.isArray(planDettails)) {
					for (var index in planDettails) {
						var planDescriber = planDettails[index];
						planString += planDescriber + "%20";
					}
				} else {
					for (var mapKey in planDettails) {
						var planObject = planDettails[mapKey];
						planString += mapKey + ":" + planObject + "%20";
					}
				}
				planString = planString.substring(0, planString.length - 3);
				break;
			default:
				break;
			}
			return planString;
		}
	};

	importModules(modulesList, RestInterface.prototype);

	return RestInterface;
}());