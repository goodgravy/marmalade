Marmalade.Router = (function () {

	return Backbone.Router.extend({
		routes: {
			"": "index",
			"track/:trackId": "track"
		},

		index: function () {
			var view = new Marmalade.Views.Index({
				model: {},
			}).render();
		},

		track: function (trackId) {
			var track = new Marmalade.Models.Track({id: trackId}),
				view = new Marmalade.Views.Track({
				model: track,
			});
		}
	});
}());

