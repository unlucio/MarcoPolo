var assert = require("assert"),
	RestInterface = require('../../libs/restInterface');

describe('Command: /document/', function () {
	it("Save object to db", function (done) {
		var orientDB = new RestInterface();
		var dummyObject = {
			"@type": 'd',
			"@class": "myTest",
			barProp: "propValue",
			fooProp: "overValue"
		};
		orientDB.saveDocument(dummyObject, function (error, result) {
			if (error === null && typeof result["@rid"] === "string") {
				done();
			} else {
				done(new Error("Cannot save object (" + error + ")"));
			}
		});
	});

	it("Get a created object from db", function (done) {
		var orientDB = new RestInterface();
		var dummyObject = {
			"@type": 'd',
			"@class": "myTest",
			barProp: "propValue",
			fooProp: "overValue"
		};
		orientDB.saveDocument(dummyObject, function (error, result) {
			orientDB.getDocument({
				rid: result["@rid"]
			}, function (error, data) {
				if (error === null && typeof result["@rid"] === "string" && result["@version"] !== undefined) {
					done();
				} else {
					done(new Error("Cannot get object (" + error + ")"));
				}
			});
		});
	});

	it("Delete a created object from db", function (done) {
		var orientDB = new RestInterface();
		var dummyObject = {
			"@type": 'd',
			"@class": "myTest",
			barProp: "propValue",
			fooProp: "overValue"
		};
		orientDB.saveDocument(dummyObject, function (error, result) {
			orientDB.deleteDocument(result["@rid"], function (error, result) {
				if (result.result === 1) {
					done();
				} else {
					done(new Error("Cannot delete assigned object"));
				}
			});
		});
	});

	it("Update a created object on db", function (done) {
		var orientDB = new RestInterface();
		var dummyObject = {
			"@type": 'd',
			"@class": "myTest",
			barProp: "propValue",
			fooProp: "overValue",
			lista: ["one", "two"]
		};
		orientDB.saveDocument(dummyObject, function (error, result) {
			result.barProp = "propChanged";
			result.fooProp = "overPropChanged";
			result.lista.push("three");
			orientDB.updateDocument(result, function (error, result) {
				if (result.result === 1) {
					done();
				} else {
					done(new Error("Cannot delete assigned object"));
				}
			});
		});
	});
});