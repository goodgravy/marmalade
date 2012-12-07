exports.getOne = function (req, res) {
	var tracks = {
		t0: {
			name: "track 0",
			parts: ["p0"],
		}
	};
	res.json(tracks[req.params.tid]);
};
