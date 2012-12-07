function init () {
	var request = new XMLHttpRequest(),
		context = new webkitAudioContext();
	window.counter = 0;
	window.boxCount = 10;
	
	request.open("GET", "http://localhost:3000/media/snare.mp3", true);
	request.responseType = "arraybuffer";
	request.onload = function () {
		context.decodeAudioData(request.response, function (buffer) {
			window.source = context.createBufferSource();
			window.source.buffer = buffer;
			window.source.connect(context.destination);
			play();
		});
	};
	request.send();
	setupHandlers();
}

function play () {
	Array.prototype.forEach.call(document.querySelectorAll(".box.active"),
		function (box) { box.classList.remove("active"); }
	);
	window.counter = (window.counter + 1) % window.boxCount;
	Array.prototype.forEach.call(
		document.querySelectorAll(".box.b"+window.counter),
		function (activeBox) {
			if (activeBox.classList.contains('enabled')) {
				window.source.noteOn(0);
			}
			activeBox.classList.add("active");
		}
	);
	window.setTimeout(play, 100);
}

function setupHandlers () {
	Array.prototype.forEach.call(
			document.querySelectorAll('.box'),
			function (box) {
				box.addEventListener('click', function () {
					toggleSelected(this);
				});
			}
	);
}

function toggleSelected (box) {
	if (box.classList.contains('enabled')) {
		box.classList.remove('enabled');
	} else {
		box.classList.add('enabled');
	}
}
