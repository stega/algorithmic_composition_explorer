var score = new Score();

window.onload = (event) => {
  document.querySelector('#genNotes').onclick  = generateNotes
  document.querySelector('#play').onclick = playGeneratedNotes
}

function generateNotes(e) {
  score.clear()
  // get text from user
  fullText = document.querySelector('#notesInput').value;
  // generate musical pattern from users text
  map_pitches(fullText);
  // display music
  score.render();
}

function playGeneratedNotes(e) {
  AudioPlayer.play(score);
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

function build_note_duration_table() {
  return note_duration_table = {
    'a': document.querySelector('#duration-select-a').value,
    'e': document.querySelector('#duration-select-e').value,
    'i': document.querySelector('#duration-select-i').value,
    'o': document.querySelector('#duration-select-o').value,
    'u': document.querySelector('#duration-select-u').value
  };
}

function map_pitches(text) {
  // create lookup tables for pitches and note duration
  note_table          = build_note_table();
  note_duration_table = build_note_duration_table();

  // loop through text & convert vowels to pitches/durations
  words   = text.toLowerCase().split(' ');
  words.forEach(function(word, index) {
    for (let char of word) {
      if (is_vowel(char)) {
        duration = note_duration_table[char];
        pitch    = note_table[char];
        score.addNote(pitch, duration);
      }
    }
  });
  score.addDoubleBarline();
}

function is_vowel(char) {
  return (char.match(/[aeiou]/)) ? true : false
}

function vowel_count(word) {
  return ((word || '').match(/[aeiou]/g) || []).length
}