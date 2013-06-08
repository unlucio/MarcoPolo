var assert = require("assert"),
	RestInterface = require('../libs/restInterface');


describe('Orient REST interface Object', function() {
	describe('Fetch Plans', function() {

		it('Can generate deep Fetch Plan', function() {
			var oriendDB = new RestInterface();
			var fetchPlan = oriendDB.evalFetchPlan('deep');
			assert.equal("*:-1", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate medium Fetch Plan', function() {
			var oriendDB = new RestInterface();
			var fetchPlan = oriendDB.evalFetchPlan('medium');
			assert.equal("*:1", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate shallow Fetch Plan', function() {
			var oriendDB = new RestInterface();
			var fetchPlan = oriendDB.evalFetchPlan('shallow');
			assert.equal("*:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from number', function() {
			var oriendDB = new RestInterface();
			var fetchPlan = oriendDB.evalFetchPlan(0);
			assert.equal("*:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from string', function() {
			var oriendDB = new RestInterface();
			var fetchPlan = oriendDB.evalFetchPlan("property:0");
			assert.equal("property:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from string (long)', function() {
			var oriendDB = new RestInterface();
			var fetchPlan = oriendDB.evalFetchPlan("property:0 property1:0 *:-1");
			assert.equal("property:0%20property1:0%20*:-1", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from plans list', function() {
			var oriendDB = new RestInterface();
			var planList = ["property1:0",
					"property2:1",
					"*:0"
			];

			var fetchPlan = oriendDB.evalFetchPlan(planList);
			assert.equal("property1:0%20property2:1%20*:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});

		it('Can generate Fetch Plan from plan object', function() {
			var oriendDB = new RestInterface();
			var planList = {
				property1: "0",
				property2: "1",
				"*": "0"
			};

			var fetchPlan = oriendDB.evalFetchPlan(planList);
			assert.equal("property1:0%20property2:1%20*:0", fetchPlan, "Fetch Plan evaluation resulted in wrong plan: " + fetchPlan);
		});
	});
	describe('Command: /database/', function() {
		it("Can access required database", function(done) {
			var oriendDB = new RestInterface({
				database: {
					name: "scrap"
				}
			});
			oriendDB.canAccessDb(function(result) {
				if (result) {
					done();
				} else {
					var err = new Error("Cannot connect to required DB");
					done(err);
				}
			});
		});
		it("Can retrive an existing database's informations", function(done) {
			var oriendDB = new RestInterface();
			oriendDB.getDb(function(error, result) {
				done();
			});
		});
		it("Can Create new DB", function(done) {
			var oriendDB = new RestInterface();
			var dbOptions = {
				name: "dummy1",
				storage: "local",
				type: "document"
			};
			oriendDB.createDb(dbOptions, function(error, result) {
				if (error !== null) {
					done();
				} else {
					var err = new Error("Error while creating new db: " + error);
					done();
				}
			});
		});

		it("Can delete database", function(done) {
			var oriendDB = new RestInterface({
				database: {
					name: 'dummy1'
				}
			});
			oriendDB.deleteDb(function(error, result) {
				if (error === null) {
					done();
				} else {
					done(error);
				}
			});
		});
		it("Create a new Db if not accessible", function(done) {
			var oriendDB = new RestInterface({
				database: {
					name: 'dummy2'
				}
			});
			oriendDB.createIfNotAccess(function(result) {
				if (result) {
					done();
					oriendDB.deleteDb();
				} else {
					var error = new Error("Cannot create required DB");
					done(error);
				}
			});
		});
	});

	describe('Command: /document/', function() {
		it("Save object to db", function(done) {
			var oriendDB = new RestInterface();
			var dummyObject = {
				"@type": 'd',
				prop: "propValue",
				otherProp: "overValue"
			};
			oriendDB.saveDocument(dummyObject, function(error, result) {
				console.log("Error: ", error);
				console.log("Result: ", result);
				done();
			});
		});
	});
});