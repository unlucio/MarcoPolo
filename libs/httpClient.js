"use strict";

var http = require('http');

// default values
var def_host = "localhost";
var def_port = 2480;
var def_auth = "admin:admin";

module.exports = (function(HttpClient) {

	HttpClient = function(options) {
		options = options || {};
		this.httpConnectionOptions = {
			host: options.host || def_host,
			port: options.port || def_port,
			auth: options.auth || def_auth,
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		};
	};

	HttpClient.prototype = {
		request: function(options, callback) {
			var self = this;
			options = options || {};

			var method = options.method || "GET";
			var endPoint = options.endPoint || "/";
			var data = options.data || null;

			this.connect(method, endPoint, data, callback);
		},
		get: function(endPoint, callback) {
			var options = {
				method: "GET",
				endPoint: endPoint
			};
			this.request(options, callback);
		},
		post: function(options, callback) {
			options.method = "POST";
			if (options.data !== null && options.data !== undefined) {
				options.data = JSON.stringify(options.data);
				this.httpConnectionOptions.headers['Content-Length'] = options.data.length;
			} else {
				options.data = null;
			}
			this.request(options, callback);
		},
		put: function(options, callback) {
			options.method = "PUT";
			if (options.data !== null && options.data !== undefined) {
				options.data = JSON.stringify(options.data);
				this.httpConnectionOptions.headers['Content-Length'] = options.data.length;
			} else {
				options.data = null;
			}
			this.request(options, callback);
		},
		delete: function(endPoint, callback) {
			var options = {
				method: "DELETE",
				endPoint: endPoint
			};
			this.request(options, callback);
		},
		handleResposeData: function(data, callback) {
			if (data.charAt(0) === "{") {
				var objectData = JSON.parse(data);
				if (typeof callback === "function") {
					callback(null, objectData);
				}
			} else {
				console.log("NOT A JSON RESPONSE: ", data);
				this.handleError(data, callback);
			}
		},
		handleResponse: function(response, callback) {
			var self = this;
			var chunks = "";
			response.on('data', function(chunk) {
				chunks += chunk;
			});

			response.on("end", function() {
				switch (response.statusCode) {
				case 200:
					self.handleResposeData(chunks, callback);
					break;
				case 204:
					callback(null, {
						result: 1
					});
					break;
				case 401:
					self.handleError({
						error: "Unauthorized"
					}, callback);
					break;
				default:
					console.log("response.statusCode ", response.statusCode);
					self.handleError(chunks, callback);
					break;
				}
			});
		},
		handleError: function(error, callback) {
			//console.log("!!!--- HTTP CLIENT ERROR : ", JSON.stringify(error));
			if (typeof callback === "function") {
				callback(error);
			}
		},
		connect: function(method, endPoint, data, callback) {
			var self = this;
			var callConfing = JSON.parse(JSON.stringify(this.httpConnectionOptions));

			callConfing.method = method;
			callConfing.path = endPoint;

			//console.log("Running request: ", callConfing);

			var request = http.request(callConfing, function(response) {
				self.handleResponse(response, callback);
			});

			request.on("error", function(error) {
				self.handleError(error, callback);
			});

			if (data !== null) {
				request.write(data, 'utf8');
			}

			request.end();
		}
	};

	return HttpClient;

}());


/*
var restConnect = function(jsonData, method, endPoint, callback, query, textOnly) {
	var post_data_json = JSON.stringify(jsonData);
	var post_data = post_data_json;
	var dataChunks = '';
	var self = this;

	var callConfing = JSON.parse(JSON.stringify(this.httpConnectionOptions));

	callConfing.path = endPoint;
	callConfing.method = method;

	if ((method === 'POST' || method === 'PUT') && endPoint.indexOf("command") === -1) {
		callConfing.headers['Content-Length'] = post_data.length;
	}

	this.debugOutput("OrientInterface ::: Orient restConnect callConfing:\n" + inspect(callConfing));
	var post_req = http.request(callConfing, function(postResponse) {
		postResponse.setEncoding('utf8');

		postResponse.on('data', function(chunk) {
			dataChunks += chunk;
		});

		postResponse.on('end', function() {
			//this.debugOutput("OrientInterface ::: Orient connection end: "+dataChunks);
			if (textOnly) {
				if (dataChunks.charAt(0) === "{") {
					callback(dataChunks);
				} else {
					if (dataChunks.indexOf("Error") > -1) {
						var textError = new Error("Orient Http Response didn't look like a JSON!");
						textError.params = {
							callConfing: callConfing,
							dataChunks: dataChunks,
							dataSent: post_data
						};
						logger.debug(inspect(textError));
					} else if (dataChunks.indexOf("was not found") > -1) {
						callback({
							result: []
						});
					}
				}
			} else {
				var responseData;
				try {
					if (dataChunks.charAt(0) === "{" && dataChunks.indexOf("the version is not the latest") === -1) { //
						responseData = JSON.parse(dataChunks, function(key, value) {
							if (!textOnly && key === 'password') {
								// cloaking user's password
								//self.debugOutput("OrientInterface ::: concealing password!");
								if (value !== "" && value !== "false") {
									return true;
								} else {
									return false;
								}
							} else if (key === 'text') {
								//self.debugOutput("OrientInterface ::: found a text key!: "+value);
								var replacedText = (value === null) ? "OUCH! text nullo! (bug risolto)" : value.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
								//self.debugOutput("OrientInterface ::: found a text key!: "+replacedText);
								return replacedText;
							} else {
								return value;
							}
						});
						self.debugOutput("OrientInterface ::: ================= orientInterface success JSON.parse for: ==================");
						self.debugOutput("OrientInterface ::: \n" + inspect(callConfing));
						self.debugOutput("OrientInterface ::: ================= /orientInterface success JSON.parse  ==================\n\n");
					} else {
						responseData = dataChunks;
						if (responseData.indexOf("Error") > -1) {
							var error = new Error("Orient Http Response didn't look like a JSON!");
							error.params = {
								callConfing: callConfing,
								responseData: responseData,
								dataSent: post_data
							};

							if (dataChunks.indexOf("the version is not the latest") > -1) {
								console.log("!!!! STUPID ORIENT ERROR : ", error);
							} else {
								console.log("ORIENT INTERFACE ERROR: ", error);
								logger.debug(inspect(error));
							}
						}
					}
				} catch (error) {
					self.debugOutput("OrientInterface ::: \n\n================= orientInterface error ==================");
					self.debugOutput("OrientInterface ::: ___________________________");
					self.debugOutput(inspect(callConfing));
					self.debugOutput("OrientInterface ::: ___________________________");
					self.debugOutput("OrientInterface ::: JSON.parse error: ", inspect(error));
					responseData = dataChunks;
					self.debugOutput("OrientInterface ::: error responseData: " + inspect(responseData));
					self.debugOutput("OrientInterface ::: ================= /orientInterface error ==================\n\n");
					error.params = {
						callConfing: callConfing,
						responseData: responseData
					};
					console.log("ORIENT INTERFACE ERROR: ", error);
					logger.debug((error));
				} finally {
					self.debugOutput("OrientInterface ::: Executing finally for restConnect -----");
					callback(responseData, query);
				}
			}
		});
	});

	//this.debugOutput("OrientInterface ::: Sending: %s to: %s", post_data, endPoint);
	post_req.on('error', function(e) {

		self.debugOutput("OrientInterface ::: \n\n================= orientInterface error ==================");
		self.debugOutput("OrientInterface ::: ___________________________");
		self.debugOutput(inspect(callConfing));
		self.debugOutput("OrientInterface ::: ___________________________");
		self.debugOutput('orientInterface error!: problem with request: ' + inspect(e));
		self.debugOutput("OrientInterface ::: ================= /orientInterface error ==================\n\n");

		e.params = {
			callConfing: callConfing
		};

		logger.debug(inspect(e));

		/*if ( e.message === 'socket hang up'){
				this.debugOutput("OrientInterface ::: RETRY!!!!!");
				post_req.write(post_data);
			}
	});

	if (jsonData !== null) {
		post_req.write(post_data, 'utf8');
	}
	post_req.end();
};*/