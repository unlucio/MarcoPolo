var assert = require("assert"),
	RestInterface = require('../../libs/restInterface');

describe('Command: /class/', function () {
	it("Can create a class", function (done) {
		var orientDB = new RestInterface();

		var classDefinition = {
			className: "TestClass",
			definition: {
				foo: {
					propertyType: "STRING"
				},
				bar: {
					propertyType: "STRING"
				}
			}
		};

		orientDB.createClass(classDefinition, function (error, result) {
			if (error === null) {
				done();
			} else {
				done(new Error("Cannot create class (" + JSON.stringify(error) + ")"));
			}
		});
	});

	it("Can fetch a class from db", function (done) {
		var orientDB = new RestInterface();
		orientDB.getClass("TestClass", function (error, result) {
			if (error === null && typeof result.class !== undefined) {
				done();
			} else {
				done(new Error("Cannot get class (" + JSON.stringify(error) + ")"));
			}
		});
	});

	it("Can delete a class from db", function (done) {
		var orientDB = new RestInterface();
		orientDB.deleteClass("TestClass", function (error, result) {
			if (error === null && typeof result.class !== undefined) {
				done();
			} else {
				done(new Error("Cannot delete class (" + JSON.stringify(error) + ")"));
			}
		});
	});

});