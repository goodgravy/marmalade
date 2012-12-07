exports.getOne = function(req, res){
	var sounds = {
		s0: { url: "/media/amen/26900__vexst__snare-1.wav" },
		s1: { url: "/media/amen/26885__vexst__kick-1.wav" },
		s2: { url: "/media/amen/26879__vexst__closed-hi-hat-1.wav" },
		s3: { url: "/media/amen/26884__vexst__crash.wav" },
	};
  	res.json(sounds[req.params.sid]);
};

