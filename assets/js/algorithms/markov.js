---
---

// add import ABC functionality to Score
Object.assign(Score.prototype, importAbcMixin);
var score  = new Score("Markov Chains");
var markov = new Markov();

window.addEventListener("load",function(event) {
  document.querySelector('#genNotes').onclick  = generateNotes
  document.querySelector('#play').onclick = playGeneratedNotes
  document.querySelector('#order').oninput = updateOrder
  document.querySelector('#bpm').oninput = updateBPM
  document.querySelector('button#tune1').onclick = play
  document.querySelector('button#tune2').onclick = play
  document.querySelector('button#tune3').onclick = play
  document.querySelector('button#tune4').onclick = play
  document.querySelector('button#tune5').onclick = play
  document.querySelector('button#tune6').onclick = play
}, false)

function generateNotes(e) {
  score.clear()
  Tone.Transport.stop()

  // get selected tunes into array
  var tunes_array = []
  var selectedTunes = document.querySelectorAll('.tune-checkbox:checked');
  for(tune of selectedTunes){
    var t = new Score()
    t.importABC(window[tune.id])
    tunes_array.push(t.scoreAsText())
  }

  // add the selected tunes to markov
  markov.addStates(tunes_array)

  // set the markov order, and train!
  var order = document.querySelector('#order').value
  markov.train(parseInt(order))

  // set the compositions BPM and key from user values
  var bpm = document.querySelector('#bpm').value
  score.tempo = bpm
  var key = document.querySelector('#key-select').value
  var scaleType = document.querySelector('input[name="scale-type-radio"]:checked').value
  score.key = key + ' ' + scaleType

  // use markov to generate the music
  var generatedNotes = markov.generateRandom(200)
  while(generatedNotes.split(' ').length < 20){
    // try again if it generated less than 20 notes
    // so we don't end up with very short compositions
    generatedNotes = markov.generateRandom(200)
  }

  // loop through all the generated notes
  // and create a new Score from them
  for(event of generatedNotes.split(' ')){
    if(event != ""){
      note = event.split(':')[0]
      len = event.split(':')[1]
      // markov can sometimes spit out odd data
      // so make sure we have a note and a well-formatted
      // duration before adding it to score
      var reggy = /([1-4]|8|16)[nm]\.?/
      if(note && reggy.test(len)){
        score.addNote(note,len)
      }
    }
  }
  score.applyKey()
  score.render()
}

function updateOrder(e) {
  document.querySelector('#order-display').innerHTML = e.target.value
}

function play(e){
  var s = new Score()
  s.importABC(window[e.target.id])
  AudioPlayer.play(s, makePiano())
}

{% include_relative music/markov-tunes.js %}
