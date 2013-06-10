var assert = require("assert"),
	RestInterface = require('../../libs/restInterface');

describe('Command: /command/', function () {
	it("Can run a command", function (done) {
		var orientDB = new RestInterface();

		var commandRequest = {
			text: "SELECT FROM OUser",
			language: "sql",
			limit: 100, // default is 20
			fetchPlan: "*:0"
		};

		orientDB.runCommand(commandRequest, function (error, result) {
			//console.log("Cluster error: ", error);
			//console.log("Cluster result: ", result);
			if (error === null) {
				done();
			} else {
				done(new Error("Cannot run command (" + JSON.stringify(error) + ")"));
			}
		});
	});
});