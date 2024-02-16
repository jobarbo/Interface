// Example to import motion capture data for the Interfaces project
// Motion Capture data © http://interfaces.7pc.de/

let seed;
let MCdata; // Object to store motion capture data
let bones = []; // Bones are connections between joints
let frame = 0; // Keeps the currently displayed frame
let lastFrame = frame;
let framesMax; // Maximum number of frames, to loop the animation
let scaleMotionData = 2; // Scale the figure on screen by a factor, "zoom"

let num = 1000;
let w = 1;
let a = 100;
let h = 0;
let s = 0;
let b = 0;
let o = 1;
let p_rand = 1;
let size = 0.25;
let blend_mode = "BLEND";

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

let maxDPI = 3;
let RATIO = 1;
let maxFrames = 60;
let DEFAULT_SIZE = 3600;
let W = window.innerWidth;
let H = window.innerHeight;
let DIM;
let MULTIPLIER;

let init_done = false;

// Dom text elements
let animation;
let dom_margin;
let dom_particleNum;
let dom_frameNum;
let dom_dpi;
let dom_ratio;
let dom_tilt;
let dom_presentation;
let dom_radius;
let dom_dashboard;
let dom_hash;
let dom_spin;
let edits = 0;

// Modes
let dashboard_mode = false;
let rotation_mode = false;
let border_mode = 0;
let presentation = false;
let ratio_name = "Bookmark";
let dom_toggle = "";

function preload() {
	// Import motion capture data
	//MCdata = loadJSON("Moonlight_frontal_by_Juliano_Nunes.json");
	MCdata = loadJSON("Moonlight_frontal_by_Juliano_Nunes.json");
	console.log(MCdata);
}

function setup() {
	DIM = min(windowWidth, windowHeight);
	MULTIPLIER = DIM / DEFAULT_SIZE;
	c = createCanvas(DIM, DIM * RATIO);
	colorMode(HSB, 360, 100, 100, 100);
	angleMode(DEGREES);
	pixelDensity(3);

	framesMax = Object.keys(MCdata).length;
	seed = random(100000);

	h = random(360);
	xMin = -0.01;
	xMax = 1.01;
	yMin = -0.01;
	yMax = 1.01;

	background(h, 5, 100);
	defineBones();

	dom_margin = document.querySelector(".kb-params.margin");
	dom_particleNum = document.querySelector(".kb-params.population");
	dom_frameNum = document.querySelector(".kb-params.exposure");
	dom_dpi = document.querySelector(".kb-params.dpi");
	dom_ratio = document.querySelector(".kb-params.ratio");
	dom_tilt = document.querySelector(".kb-params.tilt");
	dom_presentation = document.querySelector(".kb-params.presentation");
	dom_radius = document.querySelector(".kb-params.radius");
	dom_dashboard = document.querySelector(".kb-params.dashboard");
	dom_toggle = document.querySelector(".info-toggle");
	dom_hash = document.querySelector(".hash");
	dom_spin = document.querySelector(".spin-container");

	// buttons
	buttons = document.querySelectorAll("[data-button]");
	handleEvent();

	drawTexture(h);
}

function draw() {
	//background(50, 5, 100);
	//translate(width / 2, height / 2);
	//rotate(random([0, 45, 90, 135, 180, 225, 270, 315]));
	//rotate[0];
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
				/* 				x = map(x, 0, width, -width / 2, width / 2);
				y = map(y, 0, height, -height / 2, height / 2); */
				let hue = h;
				for (let i = 0; i < num; i++) {
					let initX = x + random(-p_rand, p_rand);
					let initY = y + random(-p_rand, p_rand);
					x = initX;
					y = initY;

					scl1 = random([0.0008, 0.0009, 0.001, 0.0011]);
					scl2 = scl1;

					xRandDivider = random([0.1]);
					yRandDivider = random([0.1]);
					ang1 = int(random([1, 5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560]));
					ang2 = int(random([1, 5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560]));

					let initHue = hue + random(-1, 1);
					initHue = initHue > 360 ? initHue - 360 : initHue < 0 ? initHue + 360 : initHue;
					let p = new Particle(x, y, initX, initY, initHue, scl1 / MULTIPLIER, scl2 / MULTIPLIER, ang1 * MULTIPLIER, ang2 * MULTIPLIER, xMin, xMax, yMin, yMax, xRandDivider, yRandDivider, seed);
					particles.push(p);
				}
			}
		}

		lastFrame = frame;
	}

	if (blend_mode == "ADD") {
		blendMode(ADD);
	} else {
		blendMode(BLEND);
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
		p.update(a);
		p.show();
	}

	if (frame >= framesMax) {
		frame = 0;
	}

	blendMode(BLEND);

	//drawUI();
}
function drawUI() {
	// Define the stroke color and weight (line width)
	let centerX = width / 2;
	let centerY = height / 2;
	let borderX = (xMax * width) / 2;
	let borderY = (yMax * height) / 2;

	if (bgmode == 0) {
		drawingContext.strokeStyle = "hsla(0, 5%, 100%, 100%)";
	} else {
		drawingContext.strokeStyle = "hsla(0, 5%, 10%, 100%)";
	}
	drawingContext.lineWidth = 4 * MULTIPLIER;
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
	console.log("drawTexture");
	xMin = -0.01;
	xMax = 1.01;
	yMin = -0.01;
	yMax = 1.01;
	let centerX = width / 2;
	let centerY = height / 2;
	let borderX = parseInt((xMax * width) / 2);
	let borderY = parseInt((yMax * height) / 2);

	for (let i = 0; i < 200000; i++) {
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

function handleEvent() {
	if (dom_toggle) {
		dom_toggle.addEventListener("click", function (event) {
			if (dom_toggle.classList.contains("active")) {
				dom_toggle.classList.remove("active");
				document.querySelector(".container").classList.remove("show");
				document.querySelector(".info-wrapper").classList.remove("show");
				document.querySelector(".save-wrapper").classList.remove("show");
				document.querySelector(".button-wrapper").classList.remove("show");
				document.querySelector(".icon").innerHTML = "i";
			} else {
				dom_toggle.classList.add("active");
				document.querySelector(".container").classList.add("show");
				document.querySelector(".info-wrapper").classList.add("show");
				document.querySelector(".save-wrapper").classList.add("show");
				document.querySelector(".button-wrapper").classList.add("show");
				document.querySelector(".icon").innerHTML = "X";
			}
		});
	}

	// put an event listener on all the buttons

	buttons.forEach((button) => {
		button.addEventListener("click", function (event) {
			if (button.classList.contains("btn-radius")) {
				mod_border_radius();
			}
			if (button.classList.contains("btn-presentation")) {
				mod_pres_mode();
			}
			if (button.classList.contains("btn-info")) {
				mod_info_mode();
			}
			if (button.classList.contains("btn-tilt")) {
				mod_tilt_mode();
			}
			if (button.classList.contains("btn-margin")) {
				dom_dashboard.innerHTML = "Please wait...";
				dom_spin.classList.add("active");
				mod_margin_mode();
			}
			if (button.classList.contains("btn-ratio")) {
				dom_dashboard.innerHTML = "Please wait...";
				dom_spin.classList.add("active");
				mod_ratio_mode();
			}
			if (button.classList.contains("btn-population")) {
				dom_dashboard.innerHTML = "Please wait...";
				dom_spin.classList.add("active");
				mod_particle_mode();
			}
			if (button.classList.contains("btn-exposure")) {
				dom_dashboard.innerHTML = "Please wait...";
				dom_spin.classList.add("active");
				mod_exposure_mode();
			}
			if (button.classList.contains("btn-dpi")) {
				dom_dashboard.innerHTML = "Please wait...";
				dom_spin.classList.add("active");
				mod_dpi_mode();
			}
			if (button.classList.contains("btn-save")) {
				dom_spin.classList.add("active");
				saveArtwork();
			}
		});
	});

	// if d + any number is pressed, change the dpi for that number
	document.addEventListener("keydown", function (event) {
		if (event.key === "b") {
			mod_border_radius();
		}

		// Check if the pressed key is "d" and a number
		if (event.key === "v") {
			// toggle presentation mode on or off
			mod_pres_mode();
		}

		if (event.key === "i") {
			// toggle info dashboard
			mod_info_mode();
		}

		if (event.key === "t") {
			mod_tilt_mode();
		}

		if (event.key === "m") {
			// toggle margin on or off
			mod_margin_mode();
		}
		if (event.key === "r") {
			// change the ratio
			mod_ratio_mode();
		}

		if (event.key === "p") {
			// change the particle number
			mod_particle_mode();
		}

		if (event.key === "f") {
			// change the frame number
			mod_exposure_mode();
		}

		if (event.key === "d") {
			// change the dpi
			mod_dpi_mode();
		}
	});
}
