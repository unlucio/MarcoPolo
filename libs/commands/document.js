"use strict";
var HttpClient = require('../httpClient');

module.exports = {
	saveDocument: function(object, callback) {
		var hClient = new HttpClient();
		var endpoint = "/document/" + this.confData.database.name + "/";
		var requestOptions = {
			endPoint: endpoint,
			data: object
		};

		hClient.post(requestOptions, function(error, result) {
			callback(error, result);
		});
	},
	getDocument: function(options, callback) {
		var objRid = options.rid || null;
		var fetchPlan = this.evalFetchPlan(options.fetchPlan || "shallow");
		if (objRid === null) {
			callback(new Error("Document fetching needs a valid object RID"));
		} else {
			var endPoint = "/document/" + this.confData.database.name + "/" + objRid + "/" + fetchPlan;

			var hClient = new HttpClient();
			hClient.get(endPoint, callback);
		}
	},
	deleteDocument: function(docuemntRid, callback) {
		if (docuemntRid === null) {
			callback(new Error("Document fetching needs a valid object RID"));
		} else {
			var endPoint = "/document/" + this.confData.database.name + "/" + docuemntRid;

			var hClient = new HttpClient();
			hClient.delete(endPoint, callback);
		}
	},
	updateDocument: function(documentObject, callback) {
		//console.log("documentObject: ", documentObject);
		if (documentObject !== undefined && documentObject["@rid"] !== undefined && documentObject["@version"] !== undefined && documentObject["@version"] >= 0) {
			var endPoint = "/document/" + this.confData.database.name + "/" + documentObject["@rid"];
			//documentObject["@version"] = documentObject["@version"] + 1;
			var hClient = new HttpClient();
			var requestOptions = {
				endPoint: endPoint,
				data: documentObject
			};
			var espectedResultText = "Record " + documentObject["@rid"] + " updated successfully.";
			//console.log("espectedResultText: ", espectedResultText);
			hClient.put(requestOptions, function(error, result) {
				//console.log("update got: ", result);
				if (error === null && result === espectedResultText) {
					if (typeof callback === "function") {
						callback(null, {
							result: 1
						});
					}
				} else {
					if (typeof callback === "function") {
						callback(new Error("Cannot Update (error: " + error + ", result: " + result + ")"));
					}
				}
			});
		} else {
			if (typeof callback === "function") {
				callback(new Error("This is not an OriendDB Object"));
			}
		}
	}
};