var findClicked = function (canvas, e, skipGroup) {
	var target,
		pointer = canvas.getPointer(e);

	// first check current group (if one exists)
	var activeGroup = canvas.getActiveGroup();

	if (activeGroup && !skipGroup && canvas.containsPoint(e, activeGroup)) {
		target = activeGroup;
		return target;
	}

	// then check all of the objects on canvas
	// Cache all targets where their bounding box contains point.
	var possibleTargets = [];
	for (var i = canvas._objects.length; i--; ) {
		if (canvas._objects[i] && canvas.containsPoint(e, canvas._objects[i])) {
			if (canvas.perPixelTargetFind || canvas._objects[i].perPixelTargetFind) {
				possibleTargets[possibleTargets.length] = canvas._objects[i];
			}
			else {
				target = canvas._objects[i];
				canvas.relatedTarget = target;
				break;
			}
		}
	}
	console.log(possibleTargets);
	for (var j = 0, len = possibleTargets.length; j < len; j++) {
		pointer = canvas.getPointer(e);
		var isTransparent = canvas._isTargetTransparent(possibleTargets[j], pointer.x, pointer.y);
		if (!isTransparent) {
			target = possibleTargets[j];
			canvas.relatedTarget = target;
			break;
		}
	}
	if (target) {
		return target;
	}
};


$(function () {
	var canvas = new fabric.Canvas('hello');
	var rect = new fabric.Rect({
		left: 10,
		top: 10,
		fill: 'red',
		width: 20,
		height: 20
	});
	var rect2 = new fabric.Rect({
		left: 200,
		top: 100,
		fill: 'green',
		width: 20,
		height: 20
	});
	canvas.selection = false;
	// rect.set('hasControls', false);
	rect.set('selectable', false);

	// "add" rectangle onto canvas
	canvas.add(rect);
	canvas.add(rect2);

	canvas.on('mouse:down', function(options) {
		console.log(findClicked(canvas, options.e));
		console.log(options.e.clientX, options.e.clientY);
	});

	rect.on('selected', function() {
		console.log('selected a rectangle');
	});

});