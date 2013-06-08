var assert = require("assert"),
	RestInterface = require('../libs/restInterface');


describe('Orient REST interface Object', function() {
	describe('Fetch Plans', function() {

		it('Can generate deep Fetch Plan', function() {
			var orientDB = new RestInterface();
			var fetchPlan = orientDB.evalFetchPlan('deep');
			assert.equal("*:-1", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate medium Fetch Plan', function() {
			var orientDB = new RestInterface();
			var fetchPlan = orientDB.evalFetchPlan('medium');
			assert.equal("*:1", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate shallow Fetch Plan', function() {
			var orientDB = new RestInterface();
			var fetchPlan = orientDB.evalFetchPlan('shallow');
			assert.equal("*:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from number', function() {
			var orientDB = new RestInterface();
			var fetchPlan = orientDB.evalFetchPlan(0);
			assert.equal("*:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from string', function() {
			var orientDB = new RestInterface();
			var fetchPlan = orientDB.evalFetchPlan("property:0");
			assert.equal("property:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from string (long)', function() {
			var orientDB = new RestInterface();
			var fetchPlan = orientDB.evalFetchPlan("property:0 property1:0 *:-1");
			assert.equal("property:0%20property1:0%20*:-1", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from plans list', function() {
			var orientDB = new RestInterface();
			var planList = ["property1:0",
					"property2:1",
					"*:0"
			];

			var fetchPlan = orientDB.evalFetchPlan(planList);
			assert.equal("property1:0%20property2:1%20*:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from plan object', function() {
			var orientDB = new RestInterface();
			var planList = {
				property1: "0",
				property2: "1",
				"*": "0"
			};

			var fetchPlan = orientDB.evalFetchPlan(planList);
			assert.equal("property1:0%20property2:1%20*:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});
	});
	describe('Command: /database/', function() {
		it("Can access required database", function(done) {
			var orientDB = new RestInterface({
				database: {
					name: "scrap"
				}
			});
			orientDB.canAccessDb(function(result) {
				if (result) {
					done();
				} else {
					var err = new Error("Cannot connect to required DB");
					done(err);
				}
			});
		});
		it("Can retrive an existing database's informations", function(done) {
			var orientDB = new RestInterface();
			orientDB.getDb(function(error, result) {
				done();
			});
		});
		it("Can Create new DB", function(done) {
			var orientDB = new RestInterface();
			var dbOptions = {
				name: "dummy1",
				storage: "local",
				type: "document"
			};
			orientDB.createDb(dbOptions, function(error, result) {
				if (error !== null) {
					done();
				} else {
					var err = new Error("Error while creating new db: " + error);
					done();
				}
			});
		});

		it("Can delete database", function(done) {
			var orientDB = new RestInterface({
				database: {
					name: 'dummy1'
				}
			});
			orientDB.deleteDb(function(error, result) {
				if (error === null) {
					done();
				} else {
					done(error);
				}
			});
		});
		it("Create a new Db if not accessible", function(done) {
			var orientDB = new RestInterface({
				database: {
					name: 'dummy2'
				}
			});
			orientDB.createIfNotAccess(function(result) {
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

	describe('Command: /document/', function() {
		it("Save object to db", function(done) {
			var orientDB = new RestInterface();
			var dummyObject = {
				"@type": 'd',
				"@class": "myTest",
				barProp: "propValue",
				fooProp: "overValue"
			};
			orientDB.saveDocument(dummyObject, function(error, result) {
				if (error === null && typeof result["@rid"] === "string") {
					done();
				} else {
					done(new Error("Cannot save object (" + error + ")"));
				}
			});
		});

		it("Get a created object from db", function(done) {
			var orientDB = new RestInterface();
			var dummyObject = {
				"@type": 'd',
				"@class": "myTest",
				barProp: "propValue",
				fooProp: "overValue"
			};
			orientDB.saveDocument(dummyObject, function(error, result) {
				orientDB.getDocument({
					rid: result["@rid"]
				}, function(error, data) {
					if (error === null && typeof result["@rid"] === "string" && result["@version"] !== undefined) {
						done();
					} else {
						done(new Error("Cannot get object (" + error + ")"));
					}
				});
			});
		});

		it("Delete a created object from db", function(done) {
			var orientDB = new RestInterface();
			var dummyObject = {
				"@type": 'd',
				"@class": "myTest",
				barProp: "propValue",
				fooProp: "overValue"
			};
			orientDB.saveDocument(dummyObject, function(error, result) {
				orientDB.deleteDocument(result["@rid"], function(error, result) {
					if (result.result === 1) {
						done();
					} else {
						done(new Error("Cannot delete assigned object"));
					}
				});
			});
		});

		it("Update a created object on db", function(done) {
			var orientDB = new RestInterface();
			var dummyObject = {
				"@type": 'd',
				"@class": "myTest",
				barProp: "propValue",
				fooProp: "overValue",
				lista: ["one", "two"]
			};
			orientDB.saveDocument(dummyObject, function(error, result) {
				result.barProp = "propChanged";
				result.fooProp = "overPropChanged";
				result.lista.push("three");
				orientDB.updateDocument(result, function(error, result) {
					if (result.result === 1) {
						done();
					} else {
						done(new Error("Cannot delete assigned object"));
					}
				});
			});
		});
	});
});