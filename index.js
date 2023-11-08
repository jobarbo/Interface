// Example to import motion capture data for the Interfaces project
// Motion Capture data © http://interfaces.7pc.de/

let seed;
let MCdata; // Object to store motion capture data
let bones = []; // Bones are connections between joints
let frame = 0; // Keeps the currently displayed frame
let lastFrame = frame;
let framesMax; // Maximum number of frames, to loop the animation
let scaleMotionData = 1.5; // Scale the figure on screen by a factor, "zoom"

let num = 1000;
let w = 1;
let a = 100;
let h = 0;
let s = 0;
let b = 0;
let o = 1;
let size = 0.1;

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
let DEFAULT_SIZE = 3600;
let W = window.innerWidth;
let H = window.innerHeight;
let DIM;
let MULTIPLIER;

let init_done = false;

function preload() {
	// Import motion capture data
	MCdata = loadJSON('Moonlight_frontal_by_Juliano_Nunes.json');
	//MCdata = loadJSON('Edge_Me_Away_by_Emrecan_Tanis.json');
	console.log(MCdata);
}

function setup() {
	DIM = min(windowWidth, windowHeight);
	MULTIPLIER = DIM / DEFAULT_SIZE;
	c = createCanvas(DIM, DIM);
	colorMode(HSB, 360, 100, 100, 100);
	//c = createCanvas(windowWidth, windowHeight);

	//pixelDensity(3);

	framesMax = Object.keys(MCdata).length;
	seed = random(100000);

	h = random(360);
	xMin = 0.1;
	xMax = 0.9;
	yMin = 0.1;
	yMax = 0.9;

	background(h, 5, 100);
	defineBones();
	drawTexture(h);
}

function draw() {
	//background(50, 5, 100);

	// Draw joints
	/* 	noStroke();
	drawJoints(frame);

	// Draw bones
	noFill();
	strokeWeight(0.5);
	stroke(0, 0, 100, 100);
	drawBones(frame); */

	// Loop the animation
	checkMIDI();

	// if frame value changes, destroy all particles and create new ones
	if (frame != lastFrame) {
		let joints_pos = get_all_joint_pos(frame);
		if (particles.length < 10000) {
			for (let i = 0; i < joints_pos.length; i++) {
				let {x, y} = joints_pos[i];
				/* 				let initX = x + random(-1, 1);
				let initY = y + random(-1, 1);
				x = initX;
				y = initY; */

				let hue = h;
				for (let i = 0; i < num; i++) {
					let initX = x + random(-1, 1);
					let initY = y + random(-1, 1);
					x = initX;
					y = initY;
					scl1 = random([0.0008, 0.0009, 0.001, 0.0011, 0.0012]);
					//scl1 = 0.006;
					scl2 = scl1;

					ang1 = int(random([1, 5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560]));
					ang2 = int(random([1, 5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560]));

					xRandDivider = random([0.08]);
					yRandDivider = random([0.1]);

					let initHue = hue + random(-1, 1);
					initHue = initHue > 360 ? initHue - 360 : initHue < 0 ? initHue + 360 : initHue;
					let p = new Particle(
						x,
						y,
						initX,
						initY,
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
		}

		lastFrame = frame;
	}
	//blendMode(SCREEN);
	// delete particles if they are too old or alpha is at 0
	for (let i = particles.length - 1; i >= 0; i--) {
		let p = particles[i];
		if (p.a < 0) {
			particles.splice(i, 1);
		}
	}

	for (let i = 0; i < particles.length; i++) {
		let p = particles[i];
		p.update(a);
		p.show();
	}

	if (frame >= framesMax) {
		frame = 0;
	}
	if (particles.length < 10000) {
		console.log('ok to draw more particles');
	}
	blendMode(BLEND);
	drawUI();
}
function drawUI() {
	// Define the stroke color and weight (line width)
	let centerX = width / 2;
	let centerY = height / 2;
	let borderX = (xMax * width) / 2;
	let borderY = (yMax * height) / 2;

	drawingContext.strokeStyle = 'black';
	drawingContext.lineWidth = 1 * MULTIPLIER;
	drawingContext.beginPath();

	drawingContext.moveTo(centerX - borderX, centerY - borderY);
	drawingContext.lineTo(centerX + borderX, centerY - borderY);
	drawingContext.lineTo(centerX + borderX, centerY + borderY);
	drawingContext.lineTo(centerX - borderX, centerY + borderY);
	drawingContext.lineTo(centerX - borderX, centerY - borderY);
	// Stroke the lines
	drawingContext.stroke();
}

function drawTexture(hue) {
	// draw 200000 small rects to create a texture
	console.log('drawTexture');
	xMin = 0.1;
	xMax = 0.9;
	yMin = 0.1;
	yMax = 0.9;
	let centerX = width / 2;
	let centerY = height / 2;
	let borderX = parseInt((xMax * width) / 2);
	let borderY = parseInt((yMax * height) / 2);

	for (let i = 0; i < 2000000; i++) {
		// draw the texture only inside the borderX and borderY while taking xmin and ymin into account

		let sw = Math.random() * MULTIPLIER;
		// basic x and y variable and no need to take the width of particles into account
		const x = centerX - borderX + sw / 2 + Math.random() * (2 * (borderX - sw / 2));
		const y = centerY - borderY + sw / 2 + Math.random() * (2 * (borderY - sw / 2));
		const circleX = centerX - borderX + sw + Math.random() * (2 * (borderX - sw));
		const circleY = centerY - borderY + sw + Math.random() * (2 * (borderY - sw));
		const rectX = x - sw / 2;
		const rectY = y - sw / 2;
		let h = hue + Math.random() * 2 - 1;
		let s = [0, 2, 3, 4, 4, 5, 5, 6, 7, 10][parseInt(Math.random() * 10)];
		let b = [0, 10, 20, 50, 100, 100, 100][parseInt(Math.random() * 7)];
		drawingContext.fillStyle = `hsla(${h}, ${s}%, ${b}%, 100%)`;
		drawingContext.fillRect(rectX, rectY, sw, sw);
		// draw a circle
		/* 		drawingContext.beginPath();
		drawingContext.arc(circleX, circleY, sw, 0, 2 * Math.PI);
		drawingContext.fill(); */
	}
}
