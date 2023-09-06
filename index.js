// Example to import motion capture data for the Interfaces project
// Motion Capture data © http://interfaces.7pc.de/

let seed;
let MCdata; // Object to store motion capture data
let bones = []; // Bones are connections between joints
let frame = 0; // Keeps the currently displayed frame
let lastFrame = frame;
let framesMax; // Maximum number of frames, to loop the animation
let scaleMotionData = 1; // Scale the figure on screen by a factor, "zoom"

let num = 100;
let w = 1;
let a = 100;
let h = 0;
let s = 0;
let b = 0;
let b2 = 100;

let particles = [];
let scl1;
let scl2;
let ang1;
let ang2;
let rseed;
let nseed;
let xMin;
let xMax;
let yMin;
let yMax;
let startTime;
let maxFrames = 60;
let C_WIDTH;
let MULTIPLIER;

let allParticlesDrawn = false;

function preload() {
	// Import motion capture data
	//MCdata = loadJSON('Moonlight_frontal_by_Juliano_Nunes.json');
	MCdata = loadJSON('Edge_Me_Away_by_Emrecan_Tanis.json');
	console.log(MCdata);
}

function setup() {
	C_WIDTH = min(windowWidth, windowHeight);
	MULTIPLIER = C_WIDTH / 1600;
	c = createCanvas(C_WIDTH, C_WIDTH * 1.375);
	colorMode(HSB, 360, 100, 100, 100);

	frameRate(30);
	framesMax = Object.keys(MCdata).length;
	seed = random(100000);

	h = random(360);

	background(50, 5, 100);
	defineBones();
}

function draw() {
	console.log(frame);
	//background(50, 5, 100);

	// Draw joints
	/* 	noStroke();
	drawJoints(frame); */

	/* 	// Draw bones
	noFill();
	strokeWeight(0.5);
	stroke(0, 0, 100, 100);
	drawBones(frame); */

	// Loop the animation
	checkMIDI();

	// if frame value changes, destroy all particles and create new ones
	if (frame != lastFrame) {
		let joints_pos = get_all_joint_pos(frame);

		for (let i = 0; i < joints_pos.length; i++) {
			let {x, y} = joints_pos[i];
			x = x + random(-1, 1);
			y = y + random(-1, 1);

			let hue = h;
			for (let i = 0; i < num; i++) {
				scl1 = random([0.00095, 0.001, 0.0011, 0.0012]);
				scl2 = scl1;

				ang1 = int(random([1, 5, 10, 20, 40, 80, 160, 320, 640, 1280]));
				ang2 = int(random([1, 5, 10, 20, 40, 80, 160, 320, 640, 1280]));

				xRandDivider = random([0.08, 0.09, 0.1, 0.11, 0.12]);
				yRandDivider = xRandDivider;
				xMin = -0.01;
				xMax = 1.01;
				yMin = -0.01;
				yMax = 1.01;
				let initHue = hue + random(-1, 1);
				initHue = initHue > 360 ? initHue - 360 : initHue < 0 ? initHue + 360 : initHue;
				let p = new Particle(
					x,
					y,
					initHue,
					scl1 / MULTIPLIER,
					scl2 / MULTIPLIER,
					ang1 * MULTIPLIER,
					ang2 * MULTIPLIER,
					xMin,
					xMax,
					yMin,
					yMax,
					xRandDivider,
					yRandDivider,
					seed
				);
				particles.push(p);
			}
		}
		lastFrame = frame;
	}

	// delete particles if they are too old or alpha is at 0
	for (let i = particles.length - 1; i >= 0; i--) {
		let p = particles[i];
		if (p.a < 0) {
			particles.splice(i, 1);
		}
	}

	for (let i = 0; i < particles.length; i++) {
		let p = particles[i];
		p.update();
		p.show();
	}

	if (frame >= framesMax) {
		frame = 0;
	}
}
