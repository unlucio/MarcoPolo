var assert = require("assert"),
	RestInterface = require('../../libs/restInterface');

describe('Command: /query/', function () {
	it("Can run a query", function (done) {
		var orientDB = new RestInterface();

		var queryRequest = {
			text: "SELECT FROM OUser",
			language: "sql",
			limit: 100, // default is 20
			fetchPlan: "*:0"
		};

		orientDB.runQuery(queryRequest, function (error, result) {
			//console.log("query error: ", error);
			//console.log("query result: ", result);
			if (error === null) {
				done();
			} else {
				done(new Error("Cannot run query (" + JSON.stringify(error) + ")"));
			}
		});
	});
});