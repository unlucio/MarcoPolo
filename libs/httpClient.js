"use strict";

var http = require('http');

// default values
var def_host = "localhost";
var def_port = 2480;
var def_auth = "admin:admin";

module.exports = (function (HttpClient) {

	HttpClient = function (options) {
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
		request: function (options, callback) {
			var self = this;
			options = options || {};

			var method = options.method || "GET";
			var endPoint = options.endPoint || "/";
			var data = options.data || null;

			this.connect(method, endPoint, data, callback);
		},
		get: function (endPoint, callback) {
			//console.log("GET");
			var options = {
				method: "GET",
				endPoint: endPoint
			};
			this.request(options, callback);
		},
		post: function (options, callback) {
			//console.log("POST");
			options.method = "POST";
			if (options.data !== null && options.data !== undefined) {
				options.data = JSON.stringify(options.data);
				this.httpConnectionOptions.headers['Content-Length'] = options.data.length;
			} else {
				options.data = null;
			}
			this.request(options, callback);
		},
		put: function (options, callback) {
			//console.log("PUT");
			options.method = "PUT";
			if (options.data !== null && options.data !== undefined) {
				options.data = JSON.stringify(options.data);
				this.httpConnectionOptions.headers['Content-Length'] = options.data.length;
			} else {
				options.data = null;
			}
			this.request(options, callback);
		},
		delete: function (endPoint, callback) {
			//console.log("DELETE");
			var options = {
				method: "DELETE",
				endPoint: endPoint
			};
			this.request(options, callback);
		},
		handleResposeData: function (data, callback) {
			if (data.charAt(0) === "{") {
				var objectData = JSON.parse(data);
				if (typeof callback === "function") {
					callback(null, objectData);
				}
			} else {
				//console.log("NOT A JSON RESPONSE: ", data);
				this.handlePlainTextRespose(data, callback);
			}
		},
		handlePlainTextRespose: function (data, callback) {
			if (typeof callback === "function") {
				callback(null, data);
			}
		},

		handleResponse: function (response, callback) {
			var self = this;
			var chunks = "";
			response.on('data', function (chunk) {
				chunks += chunk;
			});

			response.on("end", function () {
				//console.log("Status code: ", response.statusCode);
				switch (response.statusCode) {
				case 200: // ok
					self.handleResposeData(chunks, callback);
					break;
				case 201: // created
					self.handleResposeData(chunks, callback);
					break;
				case 204: // ok, no content to return
					callback(null, {
						result: 1
					});
					break;
				case 401:
					self.handleError({
						error: "Unauthorized"
					}, callback);
					break;
				case 500:
					callback({
						error: chunks,
						description: "http 500 status code"
					});
					break;
				default:
					console.log("response.statusCode: ", response.statusCode);
					console.log("response.chunks: ", chunks);
					self.handleError({
						bodyChunks: chunks
					}, callback);
					break;
				}
			});
		},
		handleError: function (error, callback) {
			//console.log("!!!--- HTTP CLIENT ERROR : ", JSON.stringify(error));
			if (typeof callback === "function") {
				callback(error);
			}
		},
		connect: function (method, endPoint, data, callback) {
			var self = this;
			var callConfing = JSON.parse(JSON.stringify(this.httpConnectionOptions));

			callConfing.method = method;
			callConfing.path = endPoint;

			/*if (method === 'PUT') {
				console.log("Running request: ", callConfing);
			}*/

			//console.log("Running request: ", callConfing);


			var request = http.request(callConfing, function (response) {
				self.handleResponse(response, callback);
			});

			request.on("error", function (error) {
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