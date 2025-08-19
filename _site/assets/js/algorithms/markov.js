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

var tune1 = `
X:1
T:Cainc y Datgeinaid
M:4/4
Q:160
K:D
AGFE|:D2DF A2d2|c2A2 B2c2|d2df a2d2|
c2ce a2ag| f2af d2fd|BABc d2B2|
A2Ad cdec|1 d4 AGFE:|2 d4 d2dc||
|:B2Bc d2cB|cBcd e2dc|B2BA Bcde|f3g fedc|
B2Bc d2cB|cBcd e2f2|fedc edcB|A3B AGFE|
D2DF A2d2|c2A2 B2c2|d2df a2d2|c2ce a2ag|
f2af d2fd|BABc d2B2|A2Ad cdec|1 d4 d2dc:|2d4||
`
var tune2 = `
X:1
T:Cán dan bared
M:4/4
Q:160
K:D
d2 (cA) (dfec)|(d2 cd) e3d|ecA3/2A/2 (Ad2) c|df e4 z2|
d2 cA (dfec)|(d2 cd) e3d|(ecA3/2A/2) (Ad2)c|d(f e4) z2||
`
var tune3 = `
X:1
T:Y Gelynen
M:4/4
Q:160
K:D
D2|D2(AG) (FE)(FD)|G2 (BA) (GF)(GE)|D2 (AG) (FE)(FG)|A(A,CE A)GFE|
D2 (AG) (FE)(FD)|GFGA BdBG|FAFD (EG)(EC)|D2F2D2||
A2|(dc)(de) (dc)(BA)|(GF)(GA) (Bc)(dB)|(e^d)(ef)  (cB)|
(A^GAB) (ABcA)|(dc)(de) (dc)(BA)|GFGA BdBG|(FAFD) (EGEC)|D2F2D2||
`
var tune4 = `
X: 1
T:Mortal Kombat
M:4/4
L:1/8
Q:137
K:D
F,F, A,F, B,F, CB,|A,A, CA, EA, CA,|E,E, =G,E, A,E, B,A,|
D,D, F,D, A,D, A,=G,|F,F, A,F, B,F, CB,|A,A, CA, EA, CA,|E,E, =G,E, A,E, B,A,|
D,D, F,D, A,D, A,=G,|F3/2F3/2F3/2F3/2 EA|F3/2F3/2F3/2F3/2 EC|F3/2F3/2F3/2F3/2 EA|
F3/2F3/2F F/2FF/2 F/2z3/2|F3/2F3/2F3/2F3/2 EA|F3/2F3/2F3/2F3/2 EC|F3/2F3/2F3/2F3/2 EA|
F3/2F3/2F F/2FF/2 F/2z3/2|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|
F/2cF/2 AE/2EE/2F F/2z3/2|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E/2z/2|
F,F, A,F, B,F, CB,|A,A, CA, EA, CA,|E,E, =G,E, A,E, B,A,|
D,D, F,D, A,D, A,=G,|F3/2F3/2F3/2F3/2 EA|F3/2F3/2F3/2F3/2 EC|F3/2F3/2F3/2F3/2 EA|
F3/2F3/2F F/2FF/2 F/2z3/2|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|
F/2cF/2 AE/2EE/2F F/2z3/2|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|
F/2cF/2 AE/2EE/2F F/2z3/2|
F,F, A,F, B,F, CB,|A,A, CA, EA, CA,|E,E, =G,E, A,E, B,A,|
D,D, F,D, A,D, A,=G,|F,F, A,F, B,F, CB,|A,A, CA, EA, CA,|E,E, =G,E, A,E, B,A,|
D,D, F,D, A,D, A,=G,|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|
F/2cF/2 AE/2EE/2F F/2z3/2|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E/2z/2|
F3/2F3/2F3/2F3/2 EA|F3/2F3/2F3/2F3/2 EC|F3/2F3/2F3/2F3/2 EA|
F3/2F3/2F F/2FF/2 F/2z3/2|F3/2F3/2F3/2F3/2 EA|F3/2F3/2F3/2F3/2 EC|F3/2F3/2F3/2F3/2 EA|
F3/2F3/2F F/2FF/2 F/2z3/2|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|
F/2cF/2 AE/2EE/2F F/2z3/2|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|F/2cF/2 AF/2GF/2A F/2G/2E|
F/2cF/2 AE/2EE/2F F/2z3/2|F/2cF/2 AE/2EE/2F F/2z3/2|F,F, A,F, B,F, CB,|A,A, CA, EA, CA,|
E,E, =G,E, A,E, B,A,|D,D, F,D, A,D, A,=G,|F,F, A,F, B,F, CB,|A,A, CA, EA, CA,|
E,E, =G,E, A,E, B,A,|D,D, F,D, A,D, A,=G,/2
`
var tune5 = `
X:1
T:Aeris theme
M:4/4
L:1/8
Q:72
K: D
FAd3-d/2-|d2- d/2=cAE3-E/2-|E2- E/2FAd^ced/2-|
d/2BcA4-A3/2-|A2- A/2C|
FA d2-|d4 =cA E2-|E3D4-D|
=FE DE D2D2
DEF2-F/2-|F3-F/2FGA2-A/2-|
A3-A/2Bcd2B/2-|B3-B/2G2AA3/2-|A3-A/2AFC2-C/2-|C3- C3/2F2-F/2-|
F3/2C4z2z/2|AFC2-C/2-|C4- C3/2F2-F/2-|
F3/2C4D2-D/2-|D3- D3/2
d2|c2 B2 A4|E3E/2E/2 GF ED-|D2 G2|
B2 A2-|A2
DEF2-F/2-|F3-F/2FGA2-A/2-|
`
var tune6 = `
X:1
T:Ultima Character Creation Music
Q:144
M:4/4
K:D
L:1/8
B,BfB fBBf|B,GdB dGBd|B,AeB eABe|B,FcB cFBc|
B,BfB fBBf|B,GdB dGBd|B,FcB cFBc|B,FcB c2DC|
B,BfB fBBf|B,GdB dGBd|B,AeB eABe|B,FcB cFBc|
EGdB dGBd|FAeB eABe|B,BfB fBBf|B,BfB f4|
B,,FEd EFdF|G,DEB EDBD|A,EEc EEcE|F,CEA ECAC|
B,,FEd EFdF|G,DEB EDBD|F,CEA ECAC|F,CEA- A2D,C,|
B,,FEd EFdF|G,DEB EDBD|A,EEc EEcE|F,CEA ECAC|
E,GdB dGBd|F,AeB eABe|B,,BfB fBBf|B,,8|]
`
