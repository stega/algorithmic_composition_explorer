var score = new Score("Tintinnabuli");

window.addEventListener(
  "load",
  function (event) {
    document.querySelector("#genNotes").onclick = generateNotes;
    document.querySelector("#play").onclick = playGeneratedNotes;
    document.querySelector("#bpm").oninput = updateBPM;

    document.querySelector("#seq-plus").onclick = seqPlus;
    document.querySelector("#seq-minus").onclick = seqMinus;
  },
  false,
);

function generateNotes(e) {
  score.clear();

  // get sequencer info
  var seq = document.querySelectorAll("#seq-btns input");
  pattern = [];
  for (var i = 0; i < seq.length; i++) {
    pattern.push(seq[i].checked);
  }

  // get selected key, tempo, direction, octave
  var key = document.querySelector("#key-select").value;
  var scaleType = document.querySelector(
    'input[name="scale-type-radio"]:checked',
  ).value;

  score.key = key + " " + scaleType;
  score.tempo = document.querySelector("#bpm").value;
  score.noteLength = "1/4";

  var direction = document.querySelector("#direction-select").value;
  var octave = document.querySelector("#octave-select").value;
  var chordToneSelect = document.getElementById("chordtone-select");
  var chordTones =
    chordToneSelect.options[chordToneSelect.selectedIndex].text.split("-");

  // generate scale in selected key
  var scale = generateScale(score.key, 4);

  var tPart = generateChordTones(scale, octave, chordTones);
  var rhythmPattern = convertPatternToNoteLengths(pattern);
  var mPart = applyPatternToScale(scale, [1], direction);

  // duplicate mPart 3 times
  mPart = mPart.concat(mPart).concat(mPart);

  // step through rhythm pattern and build Score from mPart & tPart notes
  var mPartIndex = 0;
  for (var i = 0; i < rhythmPattern.length; i++) {
    // get note length for this step
    var stepLen = rhythmPattern[i];

    // add the next note in the M Part to the Score
    note = mPart[mPartIndex];
    score.addNote(note, stepLen, 0);

    // add random note from the T Part to the Score
    tIndex = Math.floor(Math.random() * tPart.length);
    score.addNote(tPart[tIndex], stepLen, 1);

    // move index to the next note in the M Part
    mPartIndex += 1;

    // if we have reached the end of the rhythm patter, but still have
    // notes left to play, start the pattern over
    if (i == rhythmPattern.length - 1 && mPartIndex < mPart.length) {
      i = -1;
    }
    // if we have no more notes to add, break
    if (mPartIndex === mPart.length) {
      break;
    }
  }
  // display score
  score.render();
}

// this function creates an array of note lengths
// corresponding with the selected steps in the sequencer
function convertPatternToNoteLengths(pattern) {
  var lens = [];
  // calc note lengths
  for (const [index, trig] of pattern.entries()) {
    if (trig == 1) {
      // if the step is active
      var stepLength = 1;
      // rows of selected steps are tied together
      // to make a longer note length
      for (var j = index + 1; j < pattern.length; j++) {
        if (pattern[j] == 0) {
          stepLength++;
        } else {
          break;
        }
      }
      var noteLength = "";
      var dot = "";
      if (stepLength == 8) {
        // longer than 1 measure, so add a 1 measure note
        lens.push("1m");
      } else {
        // calculate the relative step length
        if (!Number.isInteger(8 / stepLength)) {
          dot = ".";
        }
        noteLength += Math.ceil(8 / stepLength) + "n" + dot;
        // add note length to the pattern
        lens.push(noteLength);
      }
    }
  }
  return lens;
}

/*
  takes a scale, and returns the chord tones
  Parameters:
  flavour: array, a triad [1,3,5] or a 7th [1,3,5,7]
*/
function generateChordTones(scale, octave, flavour) {
  var chordTones = [];
  flavour.forEach((i) => {
    chordTones.push(Tonal.Note.transpose(scale[i - 1], octave));
  });
  return chordTones;
}

function generateScale(key, octave) {
  scaleName = key[0] + octave + " " + key.split(" ")[1];
  return Tonal.Scale.get(scaleName).notes;
}

/*
  applyPatternToScale
  Parameters:
  scale: array, notes in scale
  pattern: array, 1 means add note at that point, 0 means dont add note
  direction: up, down, up-down, random
*/
function applyPatternToScale(scale, pattern, direction) {
  switch (direction) {
    case "up":
      break;
    case "down":
      scale.reverse();
      break;
    case "updown":
      scale = scale.concat([...scale].reverse());
      break;
    case "random":
      scale = shuffleArray(scale);
      break;
  }
  newScale = [];
  var patIndex = 0;
  for (const [index, val] of scale.entries()) {
    pattern[patIndex] == 1 && newScale.push(val);
    var patIndex = (index + 1) % pattern.length;
  }
  return newScale;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array;
}

// Manage the sequencer size
// seqPlus increases the number of steps in the sequence
function seqPlus(e) {
  var seq = document.querySelector("#seq-btns");
  var btns = document.querySelectorAll("#seq-btns input, #seq-btns label");
  var numElems = btns.length;
  // max length of sequencer should be 8 steps
  // and each step consists of 2 elements
  if (numElems < 16) {
    // don't create more than 8 steps
    var elem =
      '<input type="checkbox" class="btn-check" id="seqxxx" autocomplete="off"><label class="btn btn-outline-primary me-1" for="seqxxx">xxx</label>';
    // replace xxx with the number of the step in the sequence
    elem = elem.replace(/xxx/g, (numElems + 2) / 2);
    // add button to DOM
    seq.insertAdjacentHTML("beforeend", elem);
  }
}
// seqMinus decreases the number of steps in the sequence
function seqMinus(e) {
  var seq = document.querySelectorAll("#seq-btns input, #seq-btns label");
  if (seq.length > 1) {
    // don't remove the last step!
    seq[seq.length - 1].remove();
    seq[seq.length - 2].remove();
  }
}
