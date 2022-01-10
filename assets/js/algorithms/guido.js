let myPhrase, myPart;
// let pattern = ['F3','E3','G3','C3'];

function setup() {
  const notesInput   = document.querySelector('#notesInput');
  const notesDisplay = document.querySelector('#notesDisplay');
  const genNotesBtn  = document.querySelector('#genNotes')

  genNotesBtn.onclick = generateNotes
}

function onEachStep(time, note) {
  let velocity = 1;   // 0 to 1
  let duration = 0.1; // in seconds

  monoSynth.play(note, velocity, time, duration);
}

function playGeneratedNotes() {
  userStartAudio();
  myPart.loop();
}

function generateNotes(e) {
  let fullText = notesInput.value

  var vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}});
  var score = vf.EasyScore();
  var system = vf.System();

  system.addStave({
    voices: [score.voice(score.notes('C#5/q, B4, A4, G#4'))]
  }).addClef('treble').addTimeSignature('4/4');

  vf.draw();

  // monoSynth = new p5.MonoSynth();
  // myPhrase  = new p5.Phrase('bbox', onEachStep, pattern);
  // myPart    = new p5.Part();
  // myPart.addPhrase(myPhrase);
  // myPart.setBPM(60);
  notesDisplay.textContent = fullText;
}
