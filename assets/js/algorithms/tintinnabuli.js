var score  = new Score("Tintinnabuli")

window.onload = (event) => {
  document.querySelector('#genNotes').onclick  = generateNotes
  document.querySelector('#play').onclick = playGeneratedNotes
  document.querySelector('#bpm').oninput = updateBPM

  document.querySelector('#seq-plus').onclick = seqPlus
  document.querySelector('#seq-minus').onclick = seqMinus
}

function seqPlus(e){
  document.querySelector('#seq-btns')
}
function seqPlus(e){
}

function generateNotes(e) {
  score.clear()

  // get selected key
  var key = document.querySelector('#key-select').value
  var scaleType = document.querySelector('input[name="scale-type-radio"]:checked').value
  score.key = key + scaleType
  score.noteLength = document.querySelector('#rhythm-select option:checked').text
  score.tempo = document.querySelector('#bpm').value

  var direction = document.querySelector('#direction-select').value
  var octave = document.querySelector('#octave-select').value
  console.log(octave)

  var scale   = genScale(key)
  scale       = scale.concat(scale).concat(scale);
  var noteLen = noteLengthPattern([1,0,1,1,0])
  var mPart   = scalePattern(scale, [1], direction)
  var tPart   = genChordTones(key, octave)

  for(const [index,note] of mPart.entries()){
    // get note length from noteLen pattern
    var lenIndex = (index) % noteLen.length;
    var len = noteLen[lenIndex];
    score.addNote(note, len.toString(), 0)
    // pick random note from T Part
    tIndex = Math.floor(Math.random() * (2 + 1))
    score.addNote(tPart[tIndex], len.toString(), 1)
    lenIndex++
  }
  // console.log(score)

  score.render()
}

function noteLengthPattern(pattern) {
  var lens = []
  // calc note lengths
  for(const [index,trig] of pattern.entries()){
    if(trig == 1){
      var len = 1
      for(var j = index+1; j < pattern.length; j++){
        if(pattern[j] == 0){
          len++
        } else {
          break
        }
      }
      lens.push(len)
    }
  }
  console.log(lens)
  return lens
}

function genChordTones(key, octave) {
  var chordTones = []
  var notes = ['A','B','C','D','E','F','G']
  var notesIndex = notes.indexOf(key)
  for(var i=0; i < 3; i++){
    chordTones[i] = notes[notesIndex] + octave
    notesIndex = (notesIndex + 2) % notes.length
  }
  console.log('chordTones')
  console.log(chordTones)
  return chordTones
}

function genScale(key){
  var scale = []
  var notes = ['A','B','C','D','E','F','G']
  var notesIndex = notes.indexOf(key)
  var octave = ''
  for(var i=0; i < 8; i++){
    if(notes[notesIndex] == 'C' && i!==0){
      octave = '\''
    }
    scale[i] = notes[notesIndex] + octave
    notesIndex = (notesIndex + 1) % notes.length
  }
  return scale
}

function scalePattern(scale, pattern, direction){
  if(direction == 'down'){
    scale = scale.reverse()
  }

  newScale = []
  var patIndex = 0
  for(const [index,val] of scale.entries()){
    pattern[patIndex] == 1 && newScale.push(val)
    var patIndex = (index + 1) % pattern.length
  }
  return newScale
}

function playGeneratedNotes(e) {
  AudioPlayer.play(score.toABC())
}

function updateBPM(e) {
  document.querySelector('#bpm-display').innerHTML = e.target.value
}