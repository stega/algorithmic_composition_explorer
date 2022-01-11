let myPhrase, myPart;
// let pattern = ['F3','E3','G3','C3'];

function setup() {
  // set up tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

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
  let fullText = notesInput.value;

  pattern = map_pitches(fullText);

  // map_durations(fullText);

  console.log(pattern);

  const data = `
    tabstave notation=true

    notes :q =|: (5/2.5/3.7/4) :8 7-5h6/3 ^3^ 5h6-7/5 ^3^ :q 7V/4 |
    notes :8 t12p7/4 s5s3/4 :8 3s:16:5-7/5 :q p5/4
    text :w, |#segno, ,|, :hd, , #tr
  `

  const VF = vextab.Vex.Flow
  const renderer = new VF.Renderer($('#boo')[0],
    VF.Renderer.Backends.SVG);

  // Initialize VexTab artist and parser.
  const artist = new vextab.Artist(10, 10, 750, { scale: 0.8 });
  const tab = new vextab.VexTab(artist);

  tab.parse(data);
  artist.render(renderer);

  // var vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}});
  // var score = vf.EasyScore();
  // var system = vf.System();

  // system.addStave({
  //   voices: [score.voice(score.notes(pattern.join(', '))).setStrict(false)]
  // }).addClef('treble').addTimeSignature('4/4');

  // vf.draw();

  // monoSynth = new p5.MonoSynth();
  // myPhrase  = new p5.Phrase('bbox', onEachStep, pattern);
  // myPart    = new p5.Part();
  // myPart.addPhrase(myPhrase);
  // myPart.setBPM(60);
  // notesDisplay.textContent = fullText;
}

function build_note_table() {
  return note_table = {
    'a': document.querySelector('#pitch-select-a').value,
    'e': document.querySelector('#pitch-select-e').value,
    'i': document.querySelector('#pitch-select-i').value,
    'o': document.querySelector('#pitch-select-o').value,
    'u': document.querySelector('#pitch-select-u').value
  };
}

function map_pitches(text) {
  note_table = build_note_table();
  pattern    = [];
  words = text.toLowerCase().split(' ');
  words.forEach(function(word, index) {
    for (let char of word) {
      if (is_vowel(char)) {
        pitch = note_table[char]
        pattern.push(pitch);
      }
    }
  });
  return pattern.map(note => { return note + '/4'});
}

function map_durations(text) {

}

function is_vowel(char) {
  return (char.match(/[aeiou]/)) ? true : false
}