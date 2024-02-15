function defineBones() {
	// head
	bones.push(["MOUTH_LEFT", "MOUTH_RIGHT"]);

	bones.push(["LEFT_EYE_OUTER", "LEFT_EYE"]);
	bones.push(["LEFT_EYE", "LEFT_EYE_INNER"]);

	bones.push(["RIGHT_EYE_OUTER", "RIGHT_EYE"]);
	bones.push(["RIGHT_EYE", "RIGHT_EYE_INNER"]);

	// arms
	bones.push(["LEFT_SHOULDER", "RIGHT_SHOULDER"]);

	bones.push(["LEFT_SHOULDER", "LEFT_ELBOW"]);
	bones.push(["LEFT_ELBOW", "LEFT_WRIST"]);
	bones.push(["LEFT_WRIST", "LEFT_THUMB"]);
	bones.push(["LEFT_WRIST", "LEFT_INDEX"]);
	bones.push(["LEFT_WRIST", "LEFT_PINKY"]);

	bones.push(["RIGHT_SHOULDER", "RIGHT_ELBOW"]);
	bones.push(["RIGHT_ELBOW", "RIGHT_WRIST"]);
	bones.push(["RIGHT_WRIST", "RIGHT_THUMB"]);
	bones.push(["RIGHT_WRIST", "RIGHT_INDEX"]);
	bones.push(["RIGHT_WRIST", "RIGHT_PINKY"]);

	// legs
	bones.push(["LEFT_HIP", "RIGHT_HIP"]);

	bones.push(["LEFT_HIP", "LEFT_KNEE"]);
	bones.push(["LEFT_KNEE", "LEFT_ANKLE"]);
	bones.push(["LEFT_ANKLE", "LEFT_HEEL"]);
	bones.push(["LEFT_HEEL", "LEFT_FOOT_INDEX"]);

	bones.push(["RIGHT_HIP", "RIGHT_KNEE"]);
	bones.push(["RIGHT_KNEE", "RIGHT_ANKLE"]);
	bones.push(["RIGHT_ANKLE", "RIGHT_HEEL"]);
	bones.push(["RIGHT_HEEL", "RIGHT_FOOT_INDEX"]);
}

function drawBones(frame) {
	let joints = MCdata[frame];
	let j1, j2;
	let it = 1;

	if (joints.length > 0) {
		for (let i = 0; i < bones.length; i++) {
			let bone = bones[i];

			let joint1 = joints.find((item) => item.name === bone[0]);
			let joint2 = joints.find((item) => item.name === bone[1]);

			if (joint1 && joint2) {
				j1 = remapPos(joint1.x, joint1.y);
				j2 = remapPos(joint2.x, joint2.y);
			}
			if (j1 && j2) {
				stroke(0, 0, 0, 100);
				line(j1.x + random(-1, 1), j1.y + random(-1, 1), j2.x + random(-1, 1), j2.y + random(-1, 1));
			}
		}
	} else {
		it++;
		drawBones(frame - it);

		if (frame - it < 0) {
			return;
		}
	}
}

function drawJoints(frame) {
	let joints = MCdata[frame];
	console.log(joints);
	let j;
	let previousJoints = MCdata[frame];
	let pj;
	let it = 1;
	if (frame > 0) {
		previousJoints = MCdata[frame - 1];
	}

	if (joints.length > 0 && previousJoints.length > 0) {
		for (let i = 0; i < joints.length; i++) {
			let {x, y, type, name} = joints[i];

			// In this example we use only body joints, not detailed hands joints
			if (type === "body") {
				let {x: px, y: py} = previousJoints[i];
				j = remapPos(x, y);
				pj = remapPos(px, py);

				// convert j and pj to vectors
				j = createVector(j.x, j.y);
				pj = createVector(pj.x, pj.y);

				// calculate the distance between the two vectors

				let sw = 1;

				if (j) {
					//circle(j.x, j.y, 50);

					strokeWeight(sw);
					stroke(0, 50, 100);
					noFill();
					ellipse(j.x, j.y, 50, 50);
				}
			}
		}
	} else {
		// draw previous joints
		it++;
		drawJoints(frame - it);

		if (frame - it < 0) {
			return;
		}
	}
}

// make a function to get the position of all the joints in an array
function get_all_joint_pos(frame) {
	let joints = MCdata[frame];
	let j = [];
	for (let i = 0; i < joints.length; i++) {
		let {x, y, type, name} = joints[i];
		if (type === "body") {
			j.push(remapPos(x, y));
		}
	}
	return j;
}

// make a function to get the position of the joints
function get_joint_pos(frame, joint_name) {
	let joints = MCdata[frame];
	let j;
	for (let i = 0; i < joints.length; i++) {
		let {x, y, type, name} = joints[i];
		if (type === "body") {
			if (name === joint_name) {
				j = remapPos(x, y);
			}
		}
	}
	return j;
}

function remapPos(x, y) {
	let x1 = map(x, 0, 1, -width / 2, width / 2) * scaleMotionData + width / 2;
	let y1 = map(y, 0, 1, -height / 2, height / 2) * scaleMotionData + height / 2;
	return {x: x1, y: y1};
}

let bgmode = 0;
let pressOnce = false;
let timer;

function checkMIDI() {
	//if any knob is changed, reset the particles

	if (kname == "32") {
		size = map(int(kval), 0, 100, 0.01, 0.5, true);
		//p_rand = int(map(int(kval), 0, 100, 1, 15));
		//a = map(int(kval), 0, 100, 0, 100, true);
	}
	if (kname == "33") {
		h = int(map(int(kval), 0, 100, 0, 360, true));
	}
	if (kname == "34") {
		//s = int(map(int(kval), 0, 100, 0, 100, true));
		s = map(int(kval), 0, 100, -0.5, 0.5, true);
	}
	if (kname == "35") {
		//b = int(map(int(kval), 0, 100, 0, 100, true));
		b = map(int(kval), 0, 100, -0.5, 0.5, true);
	}
	if (kname == "36") {
		frame = int(map(int(kval), 0, 100, 0, framesMax / 4, true));
	}
	if (kname == "37") {
		frame = int(map(int(kval), 0, 100, framesMax / 4, framesMax / 2, true));
	}
	if (kname == "38") {
		frame = int(map(int(kval), 0, 100, framesMax / 2, (framesMax / 4) * 3, true));
	}
	if (kname == "39") {
		frame = int(map(int(kval), 0, 100, (framesMax / 4) * 3, framesMax, true));
	}
	if (kname == "40" && pressOnce == false) {
		particles = [];
		pressOnce = true;
		return;
	}

	if (kname == "41" && pressOnce == false) {
		particles = [];
		bgmode = 0;
		background(50, 5, 100);
		h = random(360);
		//drawTexture(h);
		blend_mode = "BLEND";
		pressOnce = true;
		return;
	}
	if (kname == "42" && pressOnce == false) {
		particles = [];
		bgmode = 1;
		background(50, 5, 10);
		h = random(360);
		blend_mode = "ADD";
		//drawTexture(h);
		pressOnce = true;
		return;
	}

	if (pressOnce == true) {
		kname = "";
		// set pressOnce to false after 1000ms
		timer = setTimeout(() => {
			pressOnce = false;
		}, 1000);
	} else {
		clearTimeout(timer);
	}
}

let mapValue = (v, s, S, a, b) => ((v = Math.min(Math.max(v, s), S)), ((v - s) * (b - a)) / (S - s) + a);
let clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
let smoothstep = (a, b, x) => (((x -= a), (x /= b - a)) < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
let mix = (a, b, p) => a + p * (b - a);
let dot = (v1, v2) => v1.x * v2.x + v1.y * v2.y;

let R = (a = 1) => Math.random() * a;
let L = (x, y) => (x * x + y * y) ** 0.5; // Elements by Euclid 300 BC
let k = (a, b) => (a > 0 && b > 0 ? L(a, b) : a > b ? a : b);

function sdf_box([x, y], [cx, cy], [w, h]) {
	x -= cx;
	y -= cy;
	return k(abs(x) - w, abs(y) - h);
}

function sdf_circle([x, y], [cx, cy], r) {
	x -= cx;
	y -= cy;
	return L(x, y) - r;
}

let dpi = (maxDPI = 3.0) => {
	let formatMode = features.format_mode;
	var ua = window.navigator.userAgent;
	var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
	var webkit = !!ua.match(/WebKit/i);
	var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

	// if safari mobile use pixelDensity(2.0) to make the canvas bigger else use pixelDensity(3.0)
	if (iOSSafari) {
		return 1.0;
	} else {
		return maxDPI;
	}
};

// if cmd + s is pressed, save the canvas'
function saveCanvas(event) {
	if (event.key === "s" && (event.metaKey || event.ctrlKey)) {
		saveArtwork();
		// Prevent the browser from saving the page
		event.preventDefault();
		return false;
	}
}

// Example usage to add an event listener for key presses
document.addEventListener("keydown", saveCanvas);

// make a function to save the canvas as a png file with the git branch name and a timestamp
function saveArtwork() {
	var dayoftheweek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	var monthoftheyear = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
	var d = new Date();
	var datestring = d.getDate() + "_" + `${d.getMonth() + 1}` + "_" + d.getFullYear() + "_" + `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
	var fileName = datestring + ".png";

	save(fileName);
	console.log("saved " + fileName);
}
