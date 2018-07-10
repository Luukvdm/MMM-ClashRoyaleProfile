
Module.register('MMM-ClashRoyaleProfile', {

	requiresVersion: '2.0.0',

	// Default module config.
	defaults: {
		updateInterval   :  300000,//Every 5 minutes
		//Devkeys can be obtained in the RoyaleApi Discord channel
		//Invite link: https://discord.gg/6XPuwM
		devKey 	         : '',
		profileTag       : '',
		animationSpeed   : 1000,
		battleListLength : 5,
		greyScale	     : false
	},

	profile : undefined,
	battles : undefined,
	chests  : undefined,
	loading	: true,

	start: function() {
		//console.error(this.name + ' is started!');
		//console.error(this.name + ' battle list length is ' + this.config.battleListLength);
		this.getData();
		this.scheduleUpdate(this.config.updateInterval);
	},

	getStyles: function () {
		return ['MMM-ClashRoyaleProfile.css'];
	},

	getData: function(){
		this.sendSocketNotification('GET_PROFILE', this.config);
		this.sendSocketNotification('GET_BATTLES', this.config);
		this.sendSocketNotification('GET_CHESTS', this.config);
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== 'undefined' && delay >= 0)
		{
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	socketNotificationReceived: function(notification, payload) {
		//console.error(this.name + ' Received notification' + notification);

		if(notification === 'GET_PROFILE') {
			this.profile = payload;
		}
		else if(notification === 'GET_BATTLES')	{
			this.battles = payload;
		}
		else if(notification == 'GET_CHESTS') {
			//Removing the upcomming chests because they arent that interesting and would take up alot of space on the mirror
			//Might make a option to turn upcomming chests on and off in the future
			delete payload.upcoming;

			var chestArray = [];

			for (var chest in payload) {
    			// skip loop if the property is from prototype
    			if (!payload.hasOwnProperty(chest)) continue;
				chestArray.push({ name : chest, value : payload[chest] } );
			}

			//sort the array
			chestArray.sort(function (a, b) { return a.value - b.value; });

			this.chests = chestArray;
		}
		else {
			return;
		}

		//We received some data to show, so we can remove the loading placeholder
		if(this.loading) this.loading = false;
		this.updateDom(this.config.animationSpeed);
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement('div');
		if(this.loading)
		{
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.classList.add('dimmed', 'light');
			return wrapper;
		}

		//PROFILE DIV
		var profileWrapper = document.createElement('div');
		var trophieWrapper = document.createElement('div');
		profileWrapper.classList.add('innerStacked');
		profileWrapper.classList.add('profileWrapper');
		profileWrapper.classList.add('no-wrap');

		if(typeof this.profile != 'undefined')
		{
			profileWrapper.innerHTML = this.profile['name'];

			var cardImg = document.createElement('img');
			if(this.config.greyScale) cardImg.classList.add('grayscale');
			cardImg.classList.add('card');
			cardImg.src = this.profile['clan']['badge']['image'];
			cardImg.alt = this.profile['clan']['badge']['name'];
			profileWrapper.appendChild(cardImg);

			//TROPHIE DIV
			trophieWrapper.classList.add('innerStacked');
			trophieWrapper.classList.add('trophieWrapper');
			trophieWrapper.classList.add('no-wrap');

			trophieWrapper.innerHTML = this.profile['trophies'] + ' /' + this.profile['stats']['maxTrophies'] + ' PB trophies';
		}

		//BATTLE DIV
		var battlesWrapper = document.createElement('div');
		battlesWrapper.classList.add('battlesWrapper');
		battlesWrapper.classList.add('innerStacked');

		var battleTable = document.createElement('table');
		battleTable.classList.add('battleTable');

		if(typeof this.battles != 'undefined')
		{
			//Im using this.config.battleListLength instead of the lenght of the array because at the time there is a bug in the api wich causes the api to ignore the limit given in the request
			//Its probably better to change it to this.battles.length, because the length of the array can be smaller then the limit
			for (var i = 0; i < this.config.battleListLength; i++)//Dit terug veranderen naar this.battles.length-1
			{
				var battle = this.battles[i];

				battleRow = document.createElement('tr');
				battleRow.classList.add('battleRow');

				var timeCol = document.createElement('td');
				timeCol.classList.add('timeCol');

				var millies = battle['utcTime'] *1000;
				var playedDate = new Date(Number(millies));
				var currentDate = new Date(Date.now());

				var strDateToDisplay = '';
				//check if battle was on the current day
				if(playedDate.getDate() === currentDate.getDate() && playedDate.getMonth() === currentDate.getMonth())
				/*&& date.getFullYear() === currentDate.getFullYear()*/ //Not gonna check for the year because im lazy, and I dont want the list to be to wide
				{
					var minutes = '0' + playedDate.getMinutes();
					var hours = playedDate.getHours();
					strDateToDisplay = hours + ':' + minutes.substr(-2);//format('H:M');
				}
				else {
					var month = playedDate.getMonth();
					var day = playedDate.getDate();
					strDateToDisplay = day + '-' + month;
				}

				timeCol.innerHTML = strDateToDisplay;

				var outcomeCol = document.createElement('td');
				outcomeCol.classList.add('battleCol');

				var outcome = '';
				var winner = battle['winner'];
				if(winner == 1) { outcome = 'W'; }
				else if(winner == 0) { outcome = 'T'; }
				else { outcome = 'L'; }
				outcomeCol.innerHTML = outcome;

				var challengeType = battle['challengeType'];
				if(challengeType == null || challengeType.match('^unknown') ) challengeType = '';
				var typeCol = document.createElement('td');
				typeCol.classList.add('battleCol');
				typeCol.innerHTML = challengeType + ' ' + battle['type'];

				battleRow.appendChild(timeCol);
				battleRow.appendChild(outcomeCol);
				battleRow.appendChild(typeCol);

				battleTable.appendChild(battleRow);
			}

			battlesWrapper.appendChild(battleTable);
		}

		//UPCOMMING CHESTS DIV
		var chestWrapper = document.createElement('div');
		chestWrapper.classList.add('chestWrapper');
		chestWrapper.classList.add('innerStacked');

		if(typeof this.chests != 'undefined')
		{
			for (var i = 0; i < this.chests.length; i++) {
				var chest = this.chests[i];

				var chestContainer = document.createElement('div');
				chestContainer.classList.add('chestContainer');

				var chestImg = document.createElement('img');
				if(this.config.greyScale) chestImg.classList.add('grayscale');
				chestImg.classList.add('chest');
				chestImg.src = './modules/MMM-ClashRoyaleProfile/images/chest-' + chest.name + '.png';
				//chestImg.alt = chest.name + ' chest image';
				chestContainer.appendChild(chestImg);

				var chestValue = document.createElement('div');
				chestValue.classList.add('chestValue');
				chestValue.innerHTML = chest.value;
				chestContainer.appendChild(chestValue);

				chestWrapper.appendChild(chestContainer);
			}
		}

		wrapper.appendChild(profileWrapper);
		wrapper.appendChild(trophieWrapper);
		wrapper.appendChild(battlesWrapper);
		wrapper.appendChild(chestWrapper);

		return wrapper;
	}

});
