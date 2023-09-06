// Example to import motion capture data for the Interfaces project
// Motion Capture data © http://interfaces.7pc.de/

let MCdata; // Object to store motion capture data
let bones = []; // Bones are connections between joints
let frame = 0; // Keeps the currently displayed frame
let framesMax; // Maximum number of frames, to loop the animation
let scaleMotionData = 2.25; // Scale the figure on screen by a factor, "zoom"

let a = 100;
let h = 0;
let s = 0;
let b = 0;
let b2 = 100;

function preload() {
	// Import motion capture data
	MCdata = loadJSON('Moonlight_frontal_by_Juliano_Nunes.json');
	//MCdata = loadJSON('Edge_Me_Away_by_Emrecan_Tanis.json');
	console.log(MCdata);
}

function setup() {
	createCanvas(16 * 100, 16 * 100);
	colorMode(HSB, 360, 100, 100, 100);
	frameRate(30);
	framesMax = Object.keys(MCdata).length;
	console.log(framesMax);
	defineBones();
	strokeWeight(1);
	background(50, 5, 100);
}

function draw() {
	// Draw joints
	noStroke();
	fill(200, 0, 100, 10);
	drawJoints(frame);

	// Draw bones
	noFill();
	strokeWeight(0.5);
	stroke(0, 0, 0, a);
	drawBones(frame);

	// Loop the animation
	checkMIDI();
	if (frame >= framesMax) {
		frame = 0;
	}
}

// Reposition in the middle of the screen and scale

function drawJoints(frame) {
	let joints = MCdata[frame];
	let j;
	let previousJoints = MCdata[frame];
	let pj;

	if (frame > 0) {
		previousJoints = MCdata[frame - 1];
	}
	for (let i = 0; i < joints.length; i++) {
		let {x, y, type, name} = joints[i];

		// In this example we use only body joints, not detailed hands joints
		if (type === 'body') {
			let {x: px, y: py} = previousJoints[i];
			j = remapPos(x, y);
			pj = remapPos(px, py);

			// convert j and pj to vectors
			j = createVector(j.x, j.y);
			pj = createVector(pj.x, pj.y);

			// calculate the distance between the two vectors
			let d = p5.Vector.dist(j, pj);
			let sw = 0.1;

			if (j) {
				sw = map(d, 0, 100, 0, 3);
				//circle(j.x, j.y, 50);

				strokeWeight(sw);

				for (let i = 0; i < 100; i++) {
					let v = p5.Vector.random2D();
					v.mult(random(2, random(10, d)));

					fill(h, s, b, a);
					// create a curved line between the two vectors
					stroke(h, s, b, a);
					line(j.x, j.y, j.x + v.x, j.y + v.y);
					stroke(h, s, b2, a);
					line(j.x + 2, j.y + 2, j.x + v.x + 2, j.y + v.y + 2);
				}
			}
		}
	}
}
