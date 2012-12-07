(function () {
	Marmalade.Views.Index = Backbone.View.extend({
		events: {
			"change select.track-picker": "trackPicked"
		},

		render: function () {
			var indexTmpl = Hogan.compile($('#index-tmpl').text());
			this.$el.html(indexTmpl.render({}));
			$('body').append(this.el);
			return this;
		},

		trackPicked: function (ev) {
			Marmalade.router.navigate('/play/' + $(ev.target).val(), true);
		}
	});
	Marmalade.Views.Track = Backbone.View.extend({
		initialize: function () {
			_.bindAll(this);
			this.binder = new Backbone.EventBinder();
			this.binder.bindTo(this.model, "change", this.render, this);
			this.model.fetch();

		},
		render: function () {
			var that = this,
				trackTmpl = Hogan.compile($('#track-tmpl').text());
			
			this.$el.html(trackTmpl.render(this.model.toJSON()));
			
			this.model.get('parts').each(this.addPart);
			$('body').append(this.el);
			return this;
		},
		addPart: function (part) {
			var partView = new Marmalade.Views.Part({model: part});
			this.$('div.parts').append(partView.el);
		}
	}),
	Marmalade.Views.Part = Backbone.View.extend({
		className: 'part',
		initialize: function (options) {
			_.bindAll(this);
			this.binder = new Backbone.EventBinder();
			this.binder.bindTo(this.model, "change", this.render, this);
			this.model.fetch();
		},
		render: function () {
			var that = this,
				partTmpl = Hogan.compile($('#part-tmpl').text());

			this.$el.html(partTmpl.render(this.model.toJSON()));
			
			this.model.get('lines').each(this.addLine);
			return this;
		},
		addLine: function (line) {
			var lineView = new Marmalade.Views.Line({model: line});
			this.$('div.lines').append(lineView.el);
			lineView.postAddRender();
		}
	}),
	Marmalade.Views.Line = Backbone.View.extend({
		className: 'line',
		initialize: function (options) {
			_.bindAll(this);
			this.binder = new Backbone.EventBinder();
			// this.binder.bindTo(this.model.get('notes'), "change", this.reRender)
			this.binder.bindTo(this.model.get('notes'), "change:playing", this.renderCanvas);
			this.render();
		},
		render: function () {
			var that = this,
				lineTmpl = Hogan.compile($('#line-tmpl').text());

			this.$el.html(lineTmpl.render(this.model.toJSON()));
			return this;
		},
		postAddRender: function () {
			var that = this;
			this.canvas = new fabric.Canvas(this.$('canvas').get(0));
			this.canvas.selection = false;

			this.canvas.on('mouse:down', function (options) {
				var target = Marmalade.Utils.findClicked(that.canvas, options.e);
				if (target) {
					target.fire('my:click');
				}
			});
			this.model.get('notes').each(this.addNote);
			return this;
		},
		renderCanvas: function () {
			this.canvas.renderAll();
		},
		addNote: function (note) {
			var noteView = new Marmalade.Views.Note({model: note, canvas: this.canvas});
			this.canvas.add(noteView.canvasEl);
		}
	}),
	Marmalade.Views.Sound = Backbone.View.extend({
		className: 'sound',
		initialize: function (options) {
			this.binder = new Backbone.EventBinder();
			this.binder.bindTo(this.model, "change", this.render, this);
			this.model.fetch();
		},
		render: function () {
			var that = this,
				soundTmpl = Hogan.compile($('#sound-tmpl').text());

			this.$el.html(soundTmpl.render(this.model.toJSON()));
			return this;
		}
	}),
	Marmalade.Views.Note = Backbone.View.extend({
		initialize: function (options) {
			_.bindAll(this);
			this.binder = new Backbone.EventBinder();
			this.binder.bindTo(this.model, "change:playing", this.changePlaying);
			this.canvas = options.canvas;
			this.render();
		},
		render: function () {
			var that = this;
			this.canvasEl = new fabric.Rect({
				left: 10 + this.model.get('start') * 20,
				top: 10,
				fill: 'green',
				width: 20,
				height: 20
			});
			this.canvasEl.set('selectable', false);
			this.canvasEl.on('my:click', function () {
				alert(that.canvasEl + ' my:click');
			});
			return this;
		},
		changePlaying: function () {
			if (this.model.get('playing')) {
				this.canvasEl.set('fill', 'red');
			} else {
				this.canvasEl.set('fill', 'green');
			}
		}
	})
})();

