(function () {
	Marmalade.Models.Track = Backbone.Model.extend({
		initialize: function () {
			var that = this;
			this.set('clock', new Marmalade.Models.Clock());
			setTimeout(function () { that.get('clock').start(500) }, 1000);
		},
		url: function () {
			return "track/"+this.id
		},

		parse: function (data) {
			var that = this,
				parts = new Marmalade.Collections.Parts(_.map(data.parts,
				function (partId) {
					return { id: partId, clock: that.get('clock') };
				})
			);
			return { parts: parts };
		}
	});
	Marmalade.Models.Clock = Backbone.Model.extend({
		initialize: function () {
			_.bindAll(this);
			this.counter = -1;
		},
		start: function (period) {
			this._timer = setInterval(this.tick, period);
		},
		stop: function () {
			clearInterval(this._timer);
		},
		tick: function () {
			this.counter += 1;
			this.trigger('tick');
		}
	})
	Marmalade.Models.Part = Backbone.Model.extend({
		initialize: function (options) {
			this.set('clock', options.clock);
			this.get('clock').on('tick', this.moveBeatForwards, this);
		},
		moveBeatForwards: function () {
			var beatCount = this.get('clock').counter % this.get('beat_count') + 1;
			if (beatCount > this.get('beat_count')) {
				beatCount = 1;
			}
			this.get('lines').each(function (line) {
				line.trigger('beat', beatCount);
			});
		},
		parse: function (data) {
			var that = this,
				res = {},
				instrument,
				beats;
			if (!Marmalade.Collections.instruments.get(data.instrument)) {
				Marmalade.Collections.instruments.add({id: data.instrument});
			}
			instrument = Marmalade.Collections.instruments.get(data.instrument);
			res.instrument = instrument;

			res.lines = new Marmalade.Collections.Lines(_(data.lines).map(function (line, index) {
				var line = new Marmalade.Models.Line({
					notes: line.notes, instrument: instrument, line_index: index
				});
				return line;
			}));

			res.beat_count = data.beat_count;

			// res.beats = new Marmalade.Collections.Beats(
			// 	_.range(data.beat_count).map(function (idx) {
			// 		var notes = _(res.notes.filter(
			// 			function (note) {
			// 				return Math.floor(note.get('start')) === idx;
			// 		}));
			// 		return new Marmalade.Models.Beat({part: that, notes: notes});
			// 	})
			// );
			return res;
		}
	});

	Marmalade.Models.Line = Backbone.Model.extend({
		initialize: function (options) {
			_.bindAll(this);
			this.on('beat', this.beat);
			this.set('notes',  new Marmalade.Collections.Notes(_.map(options.notes,
				function (note) {
					note.instrument = options.instrument;
					note.sound_index = options.line_index;
					return new Marmalade.Models.Note(note);
				})
			));
		},
		beat: function (beatCount) {
			var myNotes = this.get('notes').filter(function (note) {
				var subBeat = note.get('start') - beatCount;
				return subBeat < 1 && subBeat >= 0;
			});
			_(myNotes).each(function (note) { note.set("playing", true) });
		}
	});

	// Marmalade.Models.Beat = Backbone.Model.extend({
	// 	initialize: function (options) {
	// 		_.bindAll(this);
	// 		this.on('change active', this.changeActive);
	// 	},
	// 	changeActive: function () {
	// 		if (this.get('active')) {
	// 			this.get('notes').each(function (note) { note.play(); });
	// 		}
	// 	}
	// });
	Marmalade.Models.Note = Backbone.Model.extend({
		initialize: function () {
			_.bindAll(this);
			this.on("change:playing", this.play);
		},
		play: function () {
			if (!this.get('playing')) { return; }
			var that = this,
				source = Marmalade.audioContext.createBufferSource(),
				sound = this.get('instrument').get('sounds').at(this.get('sound_index'));
			source.connect(Marmalade.audioContext.destination);
			source.buffer = sound.get('buffer');
			source.noteOn(0);
			setTimeout(function () {
				that.set('playing', false);
			}, 500);
		}
	});

	Marmalade.Models.Instrument = Backbone.Model.extend({
		initialize: function (options) {
			this.fetch();
		},
		parse: function (data) {
			return {sounds: new Marmalade.Collections.Sounds(data.sounds)};
		}
	});
	Marmalade.Models.Sound = Backbone.Model.extend({
		initialize: function (options) {
			this.fetch();
		},
		parse: function (data) {
			var that = this,
				source = Marmalade.audioContext.createBufferSource(),
				request = new XMLHttpRequest();
			request.open("GET", data.url, true);
			request.responseType = "arraybuffer";
			request.onload = function () {
				Marmalade.audioContext.decodeAudioData(
						request.response, function (buffer) {
					that.set('buffer', buffer);
				});
			};
			request.send();
			return {};
		}
	});
})();

