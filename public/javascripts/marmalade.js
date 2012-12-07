var Marmalade = (function () {
	var Models = {};
	var Views = {};
	var Templates = {};
	var Collections = {};
	var Utils = {};

	function init () {
		Marmalade.router = new Marmalade.Router();
		Marmalade.audioContext = new webkitAudioContext();
		$(function () {
			Backbone.history.start();
		});
	}

	return {
		Models: Models,
		Views: Views,
		Templates: Templates,
		Collections: Collections,
		Utils: Utils,
		init: init
	};
}());

