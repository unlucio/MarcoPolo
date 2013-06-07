"use strict";

var HttpClient = require('./httpClient'),
	util = require('util');

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


module.exports = (function(RestInterface) {

	RestInterface = function(options) {
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
		getDb: function(callback) {
			var hClient = new HttpClient();
			hClient.get("/database/" + this.confData.database.name, function(error, result) {
				if (typeof callback === 'function') {
					callback(error, result);
				}
			});
		},
		canAccessDb: function(callback) {
			this.getDb(function(error, result) {
				var response = false;

				if (error === null) {
					response = true;
				}

				if (typeof callback === 'function') {
					callback(response);
				}
			});
		},
		createDb: function(options, callback) {
			var dbName = options.name || null;
			var dbStorage = options.storage || "memory";
			var dbType = options.type || "document";

			if (dbName !== null) {
				var hClient = new HttpClient({
					auth: "root:" + this.confData.server.rootPassword
				});

				var requestOptions = {
					endPoint: "/database/" + dbName + "/" + dbStorage + "/" + dbType
				};

				hClient.post(requestOptions, function(error, result) {
					if (typeof callback === "function") {
						callback(error, result);
					}
				});
			}
			else {
				if (typeof callback === 'function') {
					callback({error: "db name cannot be null"});
				}
			}
		},
		createIfNotAccess: function(callback){
			var self = this;

			this.canAccessDb(function(result){
				if(!result){
					self.createDb({name: self.confData.database.name}, function(error, result){
						if (typeof callback === 'function') {
							if (error === null) {
								callback(true);
							}
							else {
								callback(false);
							}
						}
					});
				}
				else{
					callback();
				}
			});
		},
		deleteDb: function (callback){
			var hClient = new HttpClient({auth: "root:"+this.confData.server.rootPassword});

			hClient.delete("/database/"+this.confData.database.name, function(error, result) {
				if (error === null && typeof result === 'object' && result.result === 1) {
					if (typeof callback === 'function') {
						callback(null, true);
					}
				} else {
					var err = new Error("Cannot delete database (error: "+JSON.stringify(error)+")");
					if (typeof callback === 'function') {
						callback(err);
					}
				}
			});
		},

		evalFetchPlan: function(planDettails) {
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
		},
	};

	return RestInterface;
}());