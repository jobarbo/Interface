class Particle {
	constructor(x, y, ix, iy, hue, scl1, scl2, ang1, ang2, xMin, xMax, yMin, yMax, xRandDivider, yRandDivider, seed) {
		this.x = x;
		this.y = y;
		this.ix = ix;
		this.iy = iy;
		this.initHue = hue;
		this.initSat = random([0, 10, 20, 20, 20, 30, 40, 40, 60, 80, 80, 90]);
		this.initBri = random([0, 10, 20, 20, 40, 40, 60, 70, 80, 90, 100]);
		this.initAlpha = 100;
		this.initS = size * MULTIPLIER;
		this.hue = this.initHue;
		this.sat = this.initSat;
		this.rndSat = random(-10, 10);
		this.bri = this.initBri;
		this.rndBri = random(-10, 10);
		this.a = this.initAlpha;
		this.hueStep = 2;
		this.s = this.initS;
		this.scl1 = scl1;
		this.scl2 = scl2;
		this.ang1 = ang1;
		this.ang2 = ang2;
		this.seed = seed;
		this.xRandDivider = xRandDivider;
		this.yRandDivider = yRandDivider;
		this.xRandSkipper = 0;
		this.yRandSkipper = 0;
		this.xRandSkipperVal = random([0.1, random(0, 0)]);
		this.yRandSkipperVal = random([0.1, random(0, 0)]);
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.oct = 2;
		this.centerX = width / 2;
		this.centerY = height / 2;
		this.borderX = (xMax * width) / 2;
		this.borderY = (yMax * height) / 2;
		this.clampvaluearray = [0.15, 0.25, 0.25, 0.015];
		this.uvalueInit = random([1, 3, 4, 5, 7, 10, 12, 15, 20, 25]);
		this.uvalue = [this.uvalueInit, this.uvalueInit, this.uvalueInit, this.uvalueInit];
		this.zombie = false;
		this.zombieAlpha = this.initAlpha;
		this.lineWeight = 0.001;
	}

	update(alpha) {
		// make the particles move according to noise;

		/* 	for (let i = 0; i < 4; i++) {
			this.uvalue[i] -= 0.01;
		} */

		let p = superCurve(this.x, this.y, this.scl1, this.scl2, this.ang1, this.ang2, this.seed, this.oct, this.clampvaluearray, this.uvalue);
		this.xRandSkipper = random(-this.xRandSkipperVal * MULTIPLIER, this.xRandSkipperVal * MULTIPLIER);
		this.yRandSkipper = random(-this.xRandSkipperVal * MULTIPLIER, this.xRandSkipperVal * MULTIPLIER);
		this.x += (p.x * MULTIPLIER) / this.xRandDivider + this.xRandSkipper;
		this.y += (p.y * MULTIPLIER) / this.yRandDivider + this.yRandSkipper;

		if (this.x < this.xMin * width || this.x > this.xMax * width || this.y < this.yMin * height || this.y > this.yMax * height) {
			this.a = 100;
			this.zombie = true;
		} else {
			this.a = this.zombie ? this.zombieAlpha : this.initAlpha;
		}

		if (this.x < this.xMin * width - this.lineWeight) {
			this.x = this.xMax * width + random() * this.lineWeight;
			this.y = this.y + random() * this.lineWeight;
			//this.a = 100;
		}
		if (this.x > this.xMax * width + this.lineWeight) {
			this.x = this.xMin * width - random() * this.lineWeight;
			this.y = this.y + random() * this.lineWeight;
			//this.a = 100;
		}
		if (this.y < this.yMin * height - this.lineWeight) {
			this.y = this.yMax * height + random() * this.lineWeight;
			this.x = this.x + random() * this.lineWeight;
			//this.a = 100;
		}
		if (this.y > this.yMax * height + this.lineWeight) {
			this.y = this.yMin * height - random() * this.lineWeight;
			this.x = this.x + random() * this.lineWeight;
			//this.a = 100;
		}

		let pxy = p.x - p.y;
		this.sat += s;
		this.bri += b;
		/* 		this.sat = s + this.rndSat;
		this.bri = b + this.rndBri; */
		this.sat = clamp(this.sat, -this.initSat, 100 + this.initSat) + random(-2, 2);
		this.bri = clamp(this.bri, -this.initBri, 100 + this.initBri) + random(-2, 2);
		this.hue += mapValue(p.x, -this.uvalue * 2, this.uvalue * 2, -this.hueStep, this.hueStep, true);
		this.hue = this.hue > 360 ? this.hue - 360 : this.hue < 0 ? this.hue + 360 : this.hue;
	}

	show() {
		fill(h, this.sat, this.bri, this.a);
		noStroke();
		rect(this.x, this.y, size);
	}
}

function superCurve(x, y, scl1, scl2, ang1, ang2, seed, octave, clampvalueArr, uvalue) {
	let nx = x,
		ny = y,
		a1 = ang1,
		a2 = ang2,
		scale1 = scl1,
		scale2 = scl2,
		dx,
		dy;
	u_value = uvalue;

	dx = oct(nx, ny, scale1, 0, octave);
	dy = oct(nx, ny, scale2, 1, octave);
	nx += dx * a1;
	ny += dy * a2;

	dx = oct(nx, ny, scale1, 2, octave);
	dy = oct(nx, ny, scale2, 3, octave);
	nx += dx * a1;
	ny += dy * a2;

	dx = oct(nx, ny, scale1, 4, octave);
	dy = oct(nx, ny, scale2, 5, octave);
	nx += dx * a1;
	ny += dy * a2;

	let un = oct(nx, ny, scale1, 2, octave);
	let vn = oct(nx, ny, scale2, 5, octave);

	let u = mapValue(un, -clampvalueArr[0], clampvalueArr[1], -u_value[0], u_value[1]);
	let v = mapValue(vn, -clampvalueArr[2], clampvalueArr[3], -u_value[2], u_value[3]);

	let p = createVector(u, v);
	return p;
}
