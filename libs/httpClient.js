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