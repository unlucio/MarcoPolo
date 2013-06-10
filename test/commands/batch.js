var assert = require("assert"),
	RestInterface = require('../../libs/restInterface');

describe('Command: /batch/', function () {
	it("Can run a batch (TODO: not implemented!)", function (done) {
		done();
		/*var orientDB = new RestInterface();

		var batchRequest = {
			transaction: true,
			operations: [{
					type: "u",
					record: {
						"@rid": "#14:122",
						name: "Luca",
						vehicle: "Car"
					}
				}, {
					type: "d",
					record: {
						"@rid": "#14:100"
					}
				}, {
					type: "c",
					record: {
						"@class": "City",
						name: "Venice"
					}
				}
			]
		};

		orientDB.runBatch(batchRequest, function (error, result) {
			//console.log("Cluster error: ", error);
			//console.log("Cluster result: ", result);
			if (error === null) {
				done();
			} else {
				done(new Error("Cannot run batch (" + JSON.stringify(error) + ")"));
			}
		});*/
	});
});