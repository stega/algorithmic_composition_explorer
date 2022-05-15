// contains array of Tone Part objects
// - one for each voice in the score
var parts = []

// Globally required callbacks can be configured here
window.addEventListener("load",function(event) {
  // set up tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}, false)

// used by all algorithms to start audio playback
function playGeneratedNotes() {
  AudioPlayer.play(score, getInstrument())
  setButtonsToPlayback()
}

function getInstrument(){
  var instrument = document.querySelector('#instrument-select').value;
  var delay = document.querySelector('#delay-switch').checked

  if(instrument == 'synth'){
    var instr = makeSynth(delay)
  } else {
    var instr = makePiano(delay)
  }
  return instr
}

function updateBPM(e) {
  document.querySelector('#bpm-display').innerHTML = e.target.value
}

function setButtonsToPlayback() {
  document.querySelector('#play').disabled = true
  document.querySelector('#stop').disabled = false
}
function resetPlaybackButtons() {
  document.querySelector('#play').disabled = false
  document.querySelector('#stop').disabled = true
}

// creates a filename friendly string in snake_case
function snakeCaseString(str) {
  return str && str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                   .map(s => s.toLowerCase())
                   .join('_')
}

function scoreToMIDI() {
  var midi = score.scoreAsMIDI()
  var midiFile = new File([midi.toArray()], `${snakeCaseString(score.title)}.mid`, {type: "audio/midi;base64"})
  saveAs(midiFile)
}

function scoreToPDF() {
  // get notation
  var notation = document.getElementById('staff')
  var filename = notation.getElementsByTagName('title')[0].text

  // format and set filename
  var options = {
    filename: snakeCaseString(filename)
  }

  // create instance of html2pdf class
  var exporter = new html2pdf(notation, options)

  // download the PDF
  exporter.getPdf(true)
}