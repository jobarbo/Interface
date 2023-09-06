// Example to import motion capture data for the Interfaces project
// Motion Capture data © http://interfaces.7pc.de/

let MCdata; // Object to store motion capture data
let bones = []; // Bones are connections between joints
let frame = 0; // Keeps the currently displayed frame
let framesMax; // Maximum number of frames, to loop the animation
let scaleMotionData = 1.25; // Scale the figure on screen by a factor, "zoom"

let a = 100;
let h = 0;
let s = 0;
let b = 0;
let b2 = 100;

function preload() {
	// Import motion capture data
	//MCdata = loadJSON('Moonlight_frontal_by_Juliano_Nunes.json');
	MCdata = loadJSON('Edge_Me_Away_by_Emrecan_Tanis.json');
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

	let joints_pos = get_all_joint_pos(frame);
}

function draw() {
	background(50, 5, 100);
	// Draw joints
	noStroke();
	drawJoints(frame);

	// Draw bones
	noFill();
	strokeWeight(0.5);
	stroke(0, 0, 100, 100);
	drawBones(frame);

	// Loop the animation
	checkMIDI();
	if (frame >= framesMax) {
		frame = 0;
	}
}
