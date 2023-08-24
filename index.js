// Example to import motion capture data for the Interfaces project
// Motion Capture data © http://interfaces.7pc.de/

let MCdata; // Object to store motion capture data
let bones = []; // Bones are connections between joints
let frame = 0; // Keeps the currently displayed frame
let framesMax; // Maximum number of frames, to loop the animation
let scaleMotionData = 2.25; // Scale the figure on screen by a factor, "zoom"

function preload() {
	// Import motion capture data
	MCdata = loadJSON('DerLiebhaber_frontal_by_Marco_Goecke.json');
	console.log(MCdata);
}

function setup() {
	createCanvas(22 * 100, 16 * 100);
	colorMode(HSB, 360, 100, 100, 100);
	frameRate(50);
	framesMax = Object.keys(MCdata).length;
	console.log(framesMax);
	defineBones();
	strokeWeight(1);
	background(50, 10, 100);
}

function draw() {
	//background(235, 224, 203, 10);
	// Draw joints
	noStroke();
	fill(200, 0, 100, 10);
	drawJoints(frame);

	// Draw bones
	noFill();
	strokeWeight(1);
	stroke(0, 0, 0, 10);
	//drawBones(frame);

	// Loop the animation
	frame++;
	if (frame >= framesMax) {
		frame = 0;
	}
}

// Reposition in the middle of the screen and scale
function remapPos(x, y) {
	let x1 = map(x, 0, 1, -800, 800) * scaleMotionData + width / 2;
	let y1 = map(y, 0, 1, -450, 450) * scaleMotionData + height / 2;
	return {x: x1, y: y1};
}

function defineBones() {
	// head
	bones.push(['MOUTH_LEFT', 'MOUTH_RIGHT']);

	bones.push(['LEFT_EYE_OUTER', 'LEFT_EYE']);
	bones.push(['LEFT_EYE', 'LEFT_EYE_INNER']);

	bones.push(['RIGHT_EYE_OUTER', 'RIGHT_EYE']);
	bones.push(['RIGHT_EYE', 'RIGHT_EYE_INNER']);

	// arms
	bones.push(['LEFT_SHOULDER', 'RIGHT_SHOULDER']);

	bones.push(['LEFT_SHOULDER', 'LEFT_ELBOW']);
	bones.push(['LEFT_ELBOW', 'LEFT_WRIST']);
	bones.push(['LEFT_WRIST', 'LEFT_THUMB']);
	bones.push(['LEFT_WRIST', 'LEFT_INDEX']);
	bones.push(['LEFT_WRIST', 'LEFT_PINKY']);

	bones.push(['RIGHT_SHOULDER', 'RIGHT_ELBOW']);
	bones.push(['RIGHT_ELBOW', 'RIGHT_WRIST']);
	bones.push(['RIGHT_WRIST', 'RIGHT_THUMB']);
	bones.push(['RIGHT_WRIST', 'RIGHT_INDEX']);
	bones.push(['RIGHT_WRIST', 'RIGHT_PINKY']);

	// legs
	bones.push(['LEFT_HIP', 'RIGHT_HIP']);

	bones.push(['LEFT_HIP', 'LEFT_KNEE']);
	bones.push(['LEFT_KNEE', 'LEFT_ANKLE']);
	bones.push(['LEFT_ANKLE', 'LEFT_HEEL']);
	bones.push(['LEFT_HEEL', 'LEFT_FOOT_INDEX']);

	bones.push(['RIGHT_HIP', 'RIGHT_KNEE']);
	bones.push(['RIGHT_KNEE', 'RIGHT_ANKLE']);
	bones.push(['RIGHT_ANKLE', 'RIGHT_HEEL']);
	bones.push(['RIGHT_HEEL', 'RIGHT_FOOT_INDEX']);
}

function drawJoints(frame) {
	let joints = MCdata[frame];
	let j;
	let previousJoints = MCdata[frame];
	let pj;
	console.log(joints.length);
	console.log(previousJoints.length);
	if (frame > 0) {
		previousJoints = MCdata[frame - 1];
	}
	for (let i = 0; i < joints.length; i++) {
		let {x, y, type, name} = joints[i];

		// In this example we use only body joints, not detailed hands joints
		if (type === 'body') {
			//if (name === 'LEFT_THUMB' || name === 'RIGHT_THUMB') {
			let {x: px, y: py} = previousJoints[i];
			j = remapPos(x, y);
			pj = remapPos(px, py);

			// convert j and pj to vectors
			j = createVector(j.x, j.y);
			pj = createVector(pj.x, pj.y);

			// calculate the distance between the two vectors
			let d = p5.Vector.dist(j, pj);
			let sw = 0.1;
			let swIteration = map(d, 0, 100, -0.1, 0.1);
			console.log(d);

			if (j) {
				sw += swIteration;
				//circle(j.x, j.y, 50);

				strokeWeight(sw);

				for (let i = 0; i < 100; i++) {
					let x = random(-40, 40);
					let y = random(-40, 40);
					stroke(75, 100, 10, 10);
					line(j.x + x, j.y + y, pj.x + x, pj.y + y);
				}
			}
			//}
		}
	}
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
			line(j1.x, j1.y, j2.x - random(-10, 10), j2.y + random(-10, 10));
		}
	}
}
