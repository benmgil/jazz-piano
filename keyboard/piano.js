class Note{
    constructor(note, octave, duration){
        this.note = note;
        this.octave = octave;
        this.duration = duration;
    }
}
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

    "harmonic-minor": [2,1,2,2,1,3,1],
    "locrian-#6": [1,2,2,1,3,1,2],
    "major-#5": [2,2,1,3,1,2,1],
    "dorian-#4": [2,1,3,1,2,1,2],
    "mixolydian-b2b6": [1,3,1,2,1,2,2],
    "lydian-#2": [3,1,2,1,2,2,1],
    "locrian-b4b7": [1,2,1,2,2,1,3]
}
var piano = Synth.createInstrument('piano');

function playNote(note){
    piano.play(note.note,note.octave,note.duration);
}

function playScale(note, octave, scale, speed){
    speed = .75;
    let intervals = modes[scale];
    let noteIndex = notes.indexOf(note);
    let currentOctave = octave;
    let notesToPlay = [];


    notesToPlay.push(new Note(notes[noteIndex],currentOctave,speed));
    for(let i = 0; i < intervals.length; i++){
        console.log(noteIndex);
        interval = intervals[i];
        noteIndex += interval;
        if(noteIndex >= notes.length){
            currentOctave++;
        }
        noteIndex = noteIndex % notes.length;
        notesToPlay.push(new Note(notes[noteIndex],currentOctave,speed));
    }
    for(let i = 0; i < notesToPlay.length; i++){
        setTimeout(function(){
            playNote(notesToPlay[i])
        },(i+1)*1000*speed);
    }
}
