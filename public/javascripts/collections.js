(function () {
	Marmalade.Collections.Tracks = Backbone.Collection.extend({
		url: 'track',
		model: Marmalade.Models.Track
	});
	Marmalade.Collections.Parts = Backbone.Collection.extend({
		url: 'part',
		model: Marmalade.Models.Part
	});
	Marmalade.Collections.Beats = Backbone.Collection.extend({
		model: Marmalade.Models.Beat
	});
	Marmalade.Collections.Lines = Backbone.Collection.extend({
		model: Marmalade.Models.Line
	});
	Marmalade.Collections.Instruments = Backbone.Collection.extend({
		url: 'instrument',
		model: Marmalade.Models.Instrument
	});
	Marmalade.Collections.instruments = new Marmalade.Collections.Instruments();
	Marmalade.Collections.Sounds = Backbone.Collection.extend({
		url: 'sound',
		model: Marmalade.Models.Sound
	});
	Marmalade.Collections.Notes = Backbone.Collection.extend({
		model: 'note'
	});
})();
