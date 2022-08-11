/* Magic Mirror
 * Module: MMM-BrawlStars
 *
 * By Mathieu Gery, https://github.com/MathieuGery
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const rp = require('request-promise');

const baseURL = 'https://api.brawlstars.com/v1/players/%23';

module.exports = NodeHelper.create({
	start: function() {
		console.log('Starting node_helper for: ' + this.name);
	},

	// Gets Google Keep note message from API and adds them to an array.
	// The array is then sent to the client (to MMM-GoogleKeep.js).
	// @param payload - identifier (string), user (string), password (string), noteName (string).
	getStats: function(payload) {
		let identifier = payload.identifier;
		let user = payload.user;
		let password = payload.password;

		console.log('je suis la ', user, password)
		let data = ['coucou', 'test']
		// let promises = [];
		// for (let i = 0; i < userTags.length; ++i) {
		// 	const userURL = baseURL + userTags[i];
		// 	const options = {uri: userURL,
		// 	                 headers: { Authorization: "Bearer " + payload.apiToken }};
		// 	promises.push(rp(options));
		// }

		// Promise.all(promises).then((contents) => {
		// 	let stats = [];

		// 	for (let i = 0; i < contents.length; ++i) {
		// 		const content = contents[i];
		// 		const json = JSON.parse(content);
				
		// 		const stat = this.extractStats(json);
		// 		stats.push(stat);
		// 	}

		// 	// Always sort by trophies first. Good if e.g. levels are equal.
		// 	stats.sort((a, b) => Number(b.trophies) - Number(a.trophies));

		// 	if ('totalVictories' === payload.sortBy)
		// 		stats.sort((a, b) => Number(b.totalVictories) - Number(a.totalVictories));
		// 	else if ('level' === payload.sortBy)
		// 		stats.sort((a, b) => Number(b.level) - Number(a.level));

		this.sendSocketNotification('NOTE_RESULT', {identifier: identifier, stats: data} );
		console.log("la c'est ma data", data)
		// }).catch(err => {
		// 	console.error(this.name + ' error when fetching data: ' + err);
		// });
	},

	// Listens to notifications from client (from MMM-GoogleKeep.js).
	// Client sends a notification when it wants get message from note.
	// @param payload - identifier (string), user (string), password (string), noteName (string).
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'GET_NOTE') {
			this.getStats(payload);
		}
	}
});
