/* Magic Mirror
 * Module: MMM-GoogleKeep
 *
 * By Mathieu Gery, https://github.com/MathieuGery
 * MIT Licensed.
 */

Module.register('MMM-GoogleKeep', {
	// Default configuration.
	defaults: {
		user: 'user@gmail.com',
		password: 'your_secret_password',
		noteName: 'checklist',
		fetchInterval: 10 * 60 * 1000  // In millisecs. Default every ten minutes.
	},

	getStyles: function() {
		return [ 'modules/MMM-GoogleKeep/MMM-GoogleKeep.css', 'font-awesome.css' ];
	},

	getTranslations: function () {
		return {
			en: 'translations/en.json',
                        sv: 'translations/sv.json',
                        fr: 'translations/fr.json'
		}
	},

	// Notification from node_helper.js.
	// The note data is received here. Then module is redrawn.
	// @param notification - Notification type.
	// @param payload - Contains module instance identifier + noteName.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'NOTE_RESULT') {
			if (null == payload)
				return;

			if (null == payload.identifier)
				return;

			if (payload.identifier !== this.identifier)  // To make sure the correct instance is updated, since they share node_helper.
				return;

			if (null == payload.stats)
				return;

			if (0 === payload.stats.length)
				return;

			console.log(payload.stats)
			this.stats = payload.stats;
			this.updateDom(0);
		}
	},

	// Override dom generator.
	getDom: function () {
		let wrapper = document.createElement('table');
		if (null == this.stats) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = 'loading dimmed xsmall';
			return wrapper;
		}

		wrapper.className = 'bright xsmall';

		let headerRow = document.createElement('tr');
		headerRow.className = 'normal header-row';
		this.createTableCell(headerRow, this.translate('USERNAME'), true, 'username-header', 'center');
		// this.createTableCell(headerRow, this.translate('LEVEL'), this.config.showLevel, 'level-header', 'center');
		// this.createTableCell(headerRow, this.translate('TROPHIES'), this.config.showTrophies, 'trophies-header', 'center');
		// this.createTableCell(headerRow, this.translate('TOTAL_VICTORIES'), this.config.showTotalVictories, 'total-victories-header', 'center');
		wrapper.appendChild(headerRow);

		for (let i = 0; i < this.stats.length; ++i) {
			let row = document.createElement('tr');
			row.className = 'normal bright';

			const stat = this.stats[i];
			this.createTableCell(row, stat, true, 'username', 'left');
			// this.createNumberTableCell(row, stat.level, this.config.showLevel, 'level');
			// this.createNumberTableCell(row, stat.trophies, this.config.showTrophies, 'trophies');
			// this.createNumberTableCell(row, stat.totalVictories, this.config.showTotalVictories, 'total-victories');

			wrapper.appendChild(row);
		}

		return wrapper;
	},

	// Override start to init stuff.
	start: function() {
		this.stats = null;

		// Tell node_helper to load stats at startup.
		this.sendSocketNotification('GET_NOTE', { identifier: this.identifier,
													user: this.config.user,
													password: this.config.password,
													noteName: this.config.noteName
												});

		// Make sure stats are reloaded at user specified interval.
		let interval = Math.max(this.config.fetchInterval, 1000);  // In millisecs. < 1 min not allowed.
		let self = this;
		setInterval(function() {
			self.sendSocketNotification('GET_NOTE', { identifier: this.identifier,
														user: this.config.user,
														password: this.config.password,
														noteName: this.config.noteName
													});
		}, interval); // In millisecs.
	},

	// Creates a table row cell.
	// @param row - The table row to add cell to.
	// @param number - The number to show.
	// @param show - Whether to actually show.
	createNumberTableCell: function(row, number, show, className)
	{
		if (!show)
			return;

		const text = new Intl.NumberFormat().format(number);
		this.createTableCell(row, text, show, className);
	},

	// Creates a table row cell.
	// @param row - The table row to add cell to.
	// @param text - The text to show.
	// @param show - Whether to actually show.
	// @param align - Text align: 'left', 'center' or 'right'.
	createTableCell: function(row, text, show, className, align = 'right')
	{
		if (!show)
			return;

		let cell = document.createElement('td');
		cell.innerHTML = text;
		cell.className = className;

		cell.style.cssText = 'text-align: ' + align + ';';

		row.appendChild(cell);
	}
});
