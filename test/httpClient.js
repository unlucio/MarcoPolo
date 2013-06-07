var assert = require("assert"),
	HttpClient = require('../libs/httpClient');

describe('Orient API Http Client', function() {
	describe('Http Connection Datas', function() {
		it('Has Options', function() {
			var hClient = new HttpClient();
			assert.equal("object", typeof hClient.httpConnectionOptions, "Missing Http config values (httpConnectionOptions).");
		});

		it('Has Host', function() {
			var hClient = new HttpClient();
			var host = hClient.httpConnectionOptions.host;

			var testResult = (typeof host === "string" && (host === "localhost" || host.length > 0));

			assert.equal(true, testResult, "Missing Orient Server Host.");
		});

		it('Has Port', function() {
			var hClient = new HttpClient();
			var port = hClient.httpConnectionOptions.port;

			var testResult = (typeof port === "number" && (port === 2480 || port > 0));

			assert.equal(true, testResult, "Missing Orient Server Port.");
		});

		it('Has Auth Datas', function() {
			var hClient = new HttpClient();
			var auth = hClient.httpConnectionOptions.auth;

			var testResult = (typeof auth === "string" && (auth === "admin:admin" || auth.length > 0));

			assert.equal(true, testResult, "Missing Orient Server Auth Datas.");
		});

		it('Has Correct Content Type', function() {
			var hClient = new HttpClient();
			var headers = hClient.httpConnectionOptions.headers;

			var testResult = (typeof headers["Content-Type"] === "string" && headers["Content-Type"] === "application/json; charset=utf-8");

			assert.equal(true, testResult, "Wrong content type, should be: application/json; charset=utf-8");
		});

	});

	describe('Orient API Http Client methods and verbs', function() {
		it('Can Connect to Server', function(done) {
			var hClient = new HttpClient();
			var requestOptions = {
				methos: "GET",
				endPoint: "/database/scrap"
			};
			hClient.request(requestOptions, function(error, result) {
				if (error === null && typeof result === 'object') {
					done();
				} else {
					var err = new Error("Cannot connect to server (error: "+JSON.stringify(error)+")");
					console.log("Result", result);
					done(err);
				}
			});
		});

		it('Can perform a GET request', function(done) {
			var hClient = new HttpClient();
			hClient.get("/database/scrap", function(error, result) {
				if (error === null && typeof result === 'object') {
					done();
				} else {
					var err = new Error("Cannot connect to server (error: "+JSON.stringify(error)+")");
					console.log("Result", result);
					done(err);
				}
			});
		});

		it('Can perform a POST request', function(done) {
			var hClient = new HttpClient({auth: "root:pippo"});

			var requestOptions = {
				endPoint: "/database/dummy/local/document"
			};

			hClient.post(requestOptions, function(error, result) {
				if (error === null && typeof result === 'object') {
					//console.log("Error: ", error);
					//console.log("Result", result);
					done();
				} else {
					var err = new Error("Cannot connect to server (error: "+JSON.stringify(error)+")");
					console.log("Result", result);
					done(err);
				}
			});
		});

		it('Can perform a DELETE request', function(done) {
			var hClient = new HttpClient({auth: "root:pippo"});

			hClient.delete("/database/dummy", function(error, result) {
				if (error === null && typeof result === 'object' && result.result === 1) {
					//console.log("Error: ", error);
					//console.log("Result", result);
					done();
				} else {
					var err = new Error("Cannot connect to server (error: "+JSON.stringify(error)+")");
					console.log("Error: ", err);
					console.log("Result", result);
					done(err);
				}
			});
		});
	});
});