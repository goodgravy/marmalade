
/*
 * GET one instrument
 */

exports.getOne = function (req, res) {
	var instruments = {
		"i0": {
			name: "instrument 0",
			sounds: [{id: "s0"}, {id: "s1"}, {id: "s2"}, {id: "s3"}],
		}
	};
	res.json(instruments[req.params.iid]);
};
