var assert = require("assert"),
	RestInterface = require('../../libs/restInterface');

describe('Command: /cluster/', function () {
	it("Can fetch a cluster from db", function (done) {
		var orientDB = new RestInterface();
		orientDB.getCluster({clusterName: "OUser"}, function (error, result) {
			//console.log("Cluster error: ", error);
			//console.log("Cluster result: ", result);
			if (error === null) {
				done();
			} else {
				done(new Error("Cannot get cluster (" + JSON.stringify(error) + ")"));
			}
		});
	});
});