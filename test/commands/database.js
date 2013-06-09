var assert = require("assert"),
	RestInterface = require('../../libs/restInterface')

describe('Command: /database/', function () {
	it("Can access required database", function (done) {
		var orientDB = new RestInterface({
			database: {
				name: "scrap"
			}
		});
		orientDB.canAccessDb(function (result) {
			if (result) {
				done();
			} else {
				var err = new Error("Cannot connect to required DB");
				done(err);
			}
		});
	});
	it("Can retrive an existing database's informations", function (done) {
		var orientDB = new RestInterface();
		orientDB.getDb(function (error, result) {
			done();
		});
	});
	it("Can Create new DB", function (done) {
		var orientDB = new RestInterface();
		var dbOptions = {
			name: "dummy1",
			storage: "local",
			type: "document"
		};
		orientDB.createDb(dbOptions, function (error, result) {
			if (error !== null) {
				done();
			} else {
				var err = new Error("Error while creating new db: " + error);
				done();
			}
		});
	});

	it("Can delete database", function (done) {
		var orientDB = new RestInterface({
			database: {
				name: 'dummy1'
			}
		});
		orientDB.deleteDb(function (error, result) {
			if (error === null) {
				done();
			} else {
				done(error);
			}
		});
	});
	it("Create a new Db if not accessible", function (done) {
		var orientDB = new RestInterface({
			database: {
				name: 'dummy2'
			}
		});
		orientDB.createIfNotAccess(function (result) {
			if (result) {
				done();
				orientDB.deleteDb();
			} else {
				var error = new Error("Cannot create required DB");
				done(error);
			}
		});
	});
});