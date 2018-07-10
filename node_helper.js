var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create ({

	start: function() {
		console.log("Starting node helper: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {

		//console.log(this.name + ": received notification " + notification);
		var config = payload;
		var url = "https://api.royaleapi.com/";
		var headers = { auth: config.devKey };
		//var formData;

		if(notification === "GET_PROFILE") {
			url += "player/" + config.profileTag;
		}
		else if(notification === "GET_BATTLES")	{
			//This solution with the ?max might be a bit ugly, but when I was working on this I didnt realise that the max feature in the API was bugged https://github.com/RoyaleAPI/cr-api/issues/407
			//So im not sure if the other solutions that I tried actually work or not...
			url += "player/" + config.profileTag + "/battles?max=" + config.battleListLength.toString();

			//url.searchParams.set('max', config.battleListLength.toString() );
			//formData = { max : config.battleListLength.toString() };
		}
		else if(notification == "GET_CHESTS") {
			url += "player/" + config.profileTag + "/chests";
		}
		else {
			return;
		}

		//console.log(this.name + ": sending request to " + url);

		var options = {
			method: 'GET',
			url: url,
			//multipart: formData,
			headers: headers//, max: config.battleListLength
		};

		console.log(this.name + ": Fetching data from " + url);
		this.getData(options, notification);
	},

	getData: function(options, name) {
		var self = this;

		request(options, function (error, response, body) {
			if(response.statusCode === 200)
			{
				var jsonObject = JSON.parse(body);
				//console.log(self.name + ": received data " + name);
				self.sendSocketNotification(name, jsonObject);
			}
			else
			{
				console.error(self.name + "Errorcode: " + " " + response.statusCode);
			}
		});
	}

});
