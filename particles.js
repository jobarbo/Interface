class Particle {
	constructor(x, y, ix, iy, hue, scl1, scl2, ang1, ang2, xMin, xMax, yMin, yMax, xRandDivider, yRandDivider, seed) {
		this.x = x;
		this.y = y;
		this.ix = ix;
		this.iy = iy;
		this.initHue = hue;
		this.initSat = random([0, 10, 20, 20, 20, 30, 40, 40, 60, 80, 80, 90]);
		this.initBri = random([0, 10, 20, 20, 40, 40, 60, 70, 80, 90, 100]);
		this.initAlpha = a;
		this.initS = size * MULTIPLIER;
		this.hue = this.initHue;
		this.sat = this.initSat;
		this.bri = this.initBri;
		this.a = this.initAlpha;
		this.hueStep = 2;
		this.s = this.initS;
		this.scl1 = scl1;
		this.scl2 = scl2;
		this.ang1 = ang1;
		this.ang2 = ang2;
		this.seed = seed;
		this.xRandDivider = 0.1;
		this.yRandDivider = 0.1;
		this.xRandSkipper = 0;
		this.yRandSkipper = 0;
		this.xRandSkipperVal = 0;
		this.yRandSkipperVal = 0;
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.oct = 3;
		this.centerX = width / 2;
		this.centerY = height / 2;
		this.borderX = (xMax * width) / 2;
		this.borderY = (yMax * height) / 2;
		this.clampvaluearray = [0.15, 0.25, 0.25, 0.015];
		this.uvalue = random([1, 3, 5, 7, 10, 12, 15, 20, 50]);
	}

	update(alpha) {
		// make the particles move according to noise;
		let p = superCurve(
			this.x,
			this.y,
			this.scl1,
			this.scl2,
			this.ang1,
			this.ang2,
			this.seed,
			this.oct,
			this.clampvaluearray,
			this.uvalue
		);
		//let particle_dist = dist(this.x, this.y, this.ix, this.iy);

		/* 		this.xRandDivider = random(0.01, 0.1);
		this.yRandDivider = random(0.01, 0.1); */
		this.xRandSkipper = random(-this.xRandSkipperVal * MULTIPLIER, this.xRandSkipperVal * MULTIPLIER);
		this.yRandSkipper = random(-this.xRandSkipperVal * MULTIPLIER, this.xRandSkipperVal * MULTIPLIER);
		this.x += (p.x * MULTIPLIER) / this.xRandDivider + this.xRandSkipper;
		this.y += (p.y * MULTIPLIER) / this.yRandDivider + this.yRandSkipper;

		this.x =
			this.x <= this.centerX - this.borderX
				? this.centerX + this.borderX + random(-4 * MULTIPLIER, 0)
				: this.x >= this.centerX + this.borderX
				? this.centerX - this.borderX + random(0, 4 * MULTIPLIER)
				: this.x;
		this.y =
			this.y <= this.centerY - this.borderY
				? this.centerY + this.borderY + random(-4 * MULTIPLIER, 0)
				: this.y >= this.centerY + this.borderY
				? this.centerY - this.borderY + random(0, 4 * MULTIPLIER)
				: this.y;

		let pxy = p.x - p.y;
		this.hue += mapValue(p.x, -this.uvalue * 2, this.uvalue * 2, -this.hueStep, this.hueStep, true);
		this.hue = this.hue > 360 ? this.hue - 360 : this.hue < 0 ? this.hue + 360 : this.hue;

		//this.s -= 0.000001;
		//this.s = clamp(this.s, 0, this.initS * 2);

		this.sat = s;
		this.bri = b;
		//this.a = alpha;
		//this.a -= 1.1;
	}

	show() {
		fill(h, this.sat, this.bri, 100);
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

	dx = oct(nx, ny, scale1, 0, octave);
	dy = oct(nx, ny, scale2, 2, octave);
	nx += dx * a1;
	ny += dy * a2;

	dx = oct(nx, ny, scale1, 1, octave);
	dy = oct(nx, ny, scale2, 3, octave);
	nx += dx * a1;
	ny += dy * a2;

	dx = oct(nx, ny, scale1, 1, octave);
	dy = oct(nx, ny, scale2, 2, octave);
	nx += dx * a1;
	ny += dy * a2;

	let un = oct(nx, ny, scale1, 0, octave);
	let vn = oct(nx, ny, scale2, 1, octave);

	let u = mapValue(un, -clampvalueArr[0], clampvalueArr[1], -uvalue, uvalue, true);
	let v = mapValue(vn, -clampvalueArr[2], clampvalueArr[3], -uvalue, uvalue, true);

	let p = createVector(u, v);
	return p;
}
