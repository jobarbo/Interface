let knob = Array(19).fill(0);

let kval = "";
let kname = "";

let circlex, circley, circlew;
let velx = 0;
let vely = 0;

if (navigator.requestMIDIAccess) {
	console.log("request midi access");
	navigator.requestMIDIAccess().then(function (midi) {
		const inputs = midi.inputs.values();
		const xtouch = [...inputs].filter((v) => v.name === "Grid")[0];

		xtouch.onmidimessage = ({data}) => {
			const knobValue = (data[2] / 128) * 100; // Calculate knob value as percentage
			knob[data[1]] = knobValue;
			kval = knobValue;
			kname = data[1];
		};
	});
}
