var assert = require("assert"),
	RestInterface = require('../../libs/restInterface');

describe('Command: /server/', function () {
	it("Can obtain server status", function (done) {
		var orientDB = new RestInterface();
		orientDB.serverStatus(function (error, result) {
			//console.log("query error: ", error);
			//console.log("query result: ", result);
			if (error === null) {
				done();
			} else {
				done(new Error("Cannot obtain server status (" + JSON.stringify(error) + ")"));
			}
		});
	});
});