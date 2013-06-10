"use strict";
var HttpClient = require('../httpClient');

module.exports = {
	getCluster: function (options, callback) {
		var clusterName = options.clusterName || null;
		var limit = options.limit || null;
		if (clusterName === null) {
			callback(new Error("Cluster fetching needs a valid Cluster name"));
		} else {
			var endPoint = "/cluster/" + this.confData.database.name + "/" + clusterName + ((limit !== null)? "/"+limit : '');

			var hClient = new HttpClient();
			hClient.get(endPoint, callback);
		}
	}
};