exports.getOne = function (req, res) {
	var parts = {
		p0: {
			name: "part 0",
			instrument: "i0",
			beat_count: 4,
			lines: [
				{notes: [{ start: 2}, { start: 4}]},
				{notes: [{ start: 1}, { start: 3}]},
				{notes: [{ start: 1}, { start: 2}, { start: 3}, { start: 4}]}
			]
		}
	};
	res.json(parts[req.params.pid]);
};
