function defineBones() {
	// head
	bones.push(['MOUTH_LEFT', 'MOUTH_RIGHT']);

	bones.push(['LEFT_EYE_OUTER', 'LEFT_EYE']);
	bones.push(['LEFT_EYE', 'LEFT_EYE_INNER']);

	bones.push(['RIGHT_EYE_OUTER', 'RIGHT_EYE']);
	bones.push(['RIGHT_EYE', 'RIGHT_EYE_INNER']);

	// arms
	/* 	bones.push(['LEFT_SHOULDER', 'RIGHT_SHOULDER']);

	bones.push(['LEFT_SHOULDER', 'LEFT_ELBOW']);
	bones.push(['LEFT_ELBOW', 'LEFT_WRIST']); */

	bones.push(['LEFT_WRIST', 'LEFT_THUMB']);
	/* 	bones.push(['LEFT_WRIST', 'LEFT_INDEX']);
	bones.push(['LEFT_WRIST', 'LEFT_PINKY']); */
	/*
	bones.push(['RIGHT_SHOULDER', 'RIGHT_ELBOW']);
	bones.push(['RIGHT_ELBOW', 'RIGHT_WRIST']); */
	bones.push(['RIGHT_WRIST', 'RIGHT_THUMB']);
	/* 	bones.push(['RIGHT_WRIST', 'RIGHT_INDEX']);
	bones.push(['RIGHT_WRIST', 'RIGHT_PINKY']); */

	// legs
	//bones.push(['LEFT_HIP', 'RIGHT_HIP']);
	bones.push(['LEFT_HIP', 'LEFT_ELBOW']);
	bones.push(['RIGHT_HIP', 'RIGHT_ELBOW']);
	bones.push(['LEFT_HIP', 'LEFT_WRIST']);
	bones.push(['RIGHT_HIP', 'RIGHT_WRIST']);

	bones.push(['LEFT_HIP', 'LEFT_KNEE']);
	bones.push(['LEFT_HIP', 'LEFT_SHOULDER']);
	bones.push(['LEFT_KNEE', 'LEFT_ANKLE']);
	bones.push(['LEFT_ANKLE', 'LEFT_HEEL']);
	bones.push(['LEFT_HEEL', 'LEFT_FOOT_INDEX']);

	bones.push(['RIGHT_HIP', 'RIGHT_KNEE']);
	bones.push(['RIGHT_HIP', 'RIGHT_SHOULDER']);
	bones.push(['RIGHT_KNEE', 'RIGHT_ANKLE']);
	bones.push(['RIGHT_ANKLE', 'RIGHT_HEEL']);
	bones.push(['RIGHT_HEEL', 'RIGHT_FOOT_INDEX']);

	/* 	bones.push(['LEFT_ANKLE', 'LEFT_WRIST']);
	bones.push(['RIGHT_ANKLE', 'RIGHT_WRIST']);
	bones.push(['LEFT_ANKLE', 'LEFT_WRIST']);
	bones.push(['RIGHT_ANKLE', 'RIGHT_WRIST']);
	bones.push(['RIGHT_WRIST', 'RIGHT_EYE']);
	bones.push(['LEFT_WRIST', 'LEFT_EYE']); */
}

function drawBones(frame) {
	let joints = MCdata[frame];
	let j1, j2;
	for (let i = 0; i < bones.length; i++) {
		let bone = bones[i];

		let joint1 = joints.find((item) => item.name === bone[0]);
		let joint2 = joints.find((item) => item.name === bone[1]);

		if (joint1 && joint2) {
			j1 = remapPos(joint1.x, joint1.y);
			j2 = remapPos(joint2.x, joint2.y);
		}
		if (j1 && j2) {
			// draw a custom shape that follows the line and joints of the body
			strokeWeight(0.5);
			stroke(random(40), random(40), random([10, 30, 40, 40, 50, 60]), a);
			//divide the line in 10 parts
			let x1 = j1.x;
			let y1 = j1.y;
			let x2 = j2.x;
			let y2 = j2.y;
			let dx = x2 - x1;
			let dy = y2 - y1;
			let steps = 10;
			let stepX = dx / steps;
			let stepY = dy / steps;
			let x = x1;
			let y = y1;
			for (let i = 0; i < steps; i++) {
				let x1 = x + random(-10, 10);
				let y1 = y + random(-10, 10);
				let x2 = x + stepX + random(-10, 10);
				let y2 = y + stepY + random(-10, 10);
				line(x1, y1, x2, y2);
				x += stepX;
				y += stepY;
			}
		}
	}
}

function remapPos(x, y) {
	let x1 = map(x, 0, 1, -width / 2, width / 2) * scaleMotionData + width / 1.5;
	let y1 = map(y, 0, 1, -height / 2, height / 2) * scaleMotionData + height / 2;
	return {x: x1, y: y1};
}

function checkMIDI() {
	if (kname == '32') {
		a = int(map(int(kval), 0, 100, 0, 100, true));
	}
	if (kname == '33') {
		h = int(map(int(kval), 0, 100, 0, 360, true));
	}
	if (kname == '34') {
		s = int(map(int(kval), 0, 100, 0, 100, true));
	}
	if (kname == '35') {
		b = int(map(int(kval), 0, 100, 0, 100, true));
		b2 = int(map(int(kval), 0, 100, 100, 0, true));
	}
	if (kname == '36') {
		frame = int(map(int(kval), 0, 100, 0, framesMax / 4, true));
	}
	if (kname == '37') {
		frame = int(map(int(kval), 0, 100, framesMax / 4, framesMax / 3, true));
	}
	if (kname == '38') {
		frame = int(map(int(kval), 0, 100, framesMax / 3, framesMax / 2, true));
	}
	if (kname == '39') {
		frame = int(map(int(kval), 0, 100, framesMax / 2, framesMax, true));
	}
}
