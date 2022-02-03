var score = new Score();

window.onload = (event) => {
  document.querySelector('#genNotes').onclick  = generateNotes
  document.querySelector('#play').onclick = playGeneratedNotes
}

function generateNotes(e) {
  score.clear()
  // get text from user
  fullText = document.querySelector('#notes-input').value;
  // generate musical pattern from users text
  mapPitches(fullText);
  // display music
  score.render();
}

function playGeneratedNotes(e) {
  AudioPlayer.play(score);
}

function buildPitchTable() {
  return pitchTable = {
    'a': document.querySelector('#pitch-select-a').value,
    'e': document.querySelector('#pitch-select-e').value,
    'i': document.querySelector('#pitch-select-i').value,
    'o': document.querySelector('#pitch-select-o').value,
    'u': document.querySelector('#pitch-select-u').value
  };
}

function buildDurationTable() {
  return durationTable = {
    'a': document.querySelector('#duration-select-a').value,
    'e': document.querySelector('#duration-select-e').value,
    'i': document.querySelector('#duration-select-i').value,
    'o': document.querySelector('#duration-select-o').value,
    'u': document.querySelector('#duration-select-u').value
  };
}

function mapPitches(text) {
  // create lookup tables for pitches and note duration
  pitchTable    = buildPitchTable();
  durationTable = buildDurationTable();

  // loop through text & convert vowels to pitches/durations
  words = text.toLowerCase().split(' ');
  words.forEach(function(word, index) {
    for (let char of word) {
      if (isVowel(char)) {
        duration = durationTable[char];
        pitch    = pitchTable[char];
        score.addNote(pitch, duration);
      }
    }
  });
  score.addDoubleBarline();
}

function isVowel(char) {
  return (char.match(/[aeiou]/)) ? true : false
}

function vowelCount(word) {
  return ((word || '').match(/[aeiou]/g) || []).length
}