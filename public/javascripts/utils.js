(function () {
	Marmalade.Utils.findClicked = function (canvas, e, skipGroup) {
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
	}
})();