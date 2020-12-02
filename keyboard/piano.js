const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const modes = {
    "major": [2,2,1,2,2,2,1],
    "dorian": [2,1,2,2,2,1,2],
    "phrygian": [1,2,2,2,1,2,2],
    "lydian": [2,2,2,1,2,2,1],
    "mixolydian": [2,2,1,2,2,1,2],
    "aeolian": [2,1,2,2,1,2,2],
    "locrian": [1,2,2,1,2,2,2],

    "melodic-minor": [2,1,2,2,2,2,1],
    "dorian-b2": [1,2,2,2,2,1,2],
    "lydian-augmented": [2,2,2,2,1,2,1],
    "lydian-dominant": [2,2,2,1,2,1,2],
    "mixolydian-b6": [2,2,1,2,1,2,2],
    "locrian-#2": [2,1,2,1,2,2,2],
    "super-locrian": [1,2,1,2,2,2,2],

    "harmonic-minor": [2,1,2,2,1,2,1],
    "locrian-#6": [1,2,2,1,2,1,2],
    "major-#5": [2,2,1,2,1,2,1],
    "dorian-#4": [2,1,2,1,2,1,2],
    "mixolydian-b2b6": [1,2,1,2,1,2,2],
    "lydian-#2": [2,1,2,1,2,2,1],
    "locrian-b4b7": [1,2,1,2,2,1,2]
}
var piano = Synth.createInstrument('piano');

function playNote(note,octave,duration){
    piano.play(note,octave,duration);
}

function playScale(note, octave, scale){
    speed = 1;
    let intervals = modes[scale];
    let noteIndex = notes.indexOf(note);
    let currentOctave = octave;

    for(let i = 0; i < intervals.length; i++){
        console.log(noteIndex);
        interval = intervals[i];
        noteIndex += interval;
        if(noteIndex >= notes.length){
            currentOctave++;
        }
        noteIndex = noteIndex % notes.length;
        setTimeout(function(){
            
            playNote(notes[noteIndex],currentOctave,speed)
        },i*1000);
    }
}
