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
});