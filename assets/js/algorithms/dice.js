---
---
var score  = new Score();

  var MeasureGrid = [
    [96,22,141,41,105,122,11,30,70,121,26,9,112,49,109,14],
    [32, 6,128,63,146,46,134,81,117,39,126,56,174,18,116,83],
    [69,95,158,13,153,55,110,24,66,136,15,132,73,58,145,79],
    [40,17,113,85,161,2,159,100,90,176,7,34,67,160,52,170],
    [148,74,163,45,80,97,36,107,25,143,64,125,76,136,1,93],
    [104,157,27,167,154,68,118,91,138,71,150,29,101,162,23,151],
    [152,60,171,53,99,133,21,127,16,155,57,175,43,168,89,172],
    [119,84,114,50,140,86,169,94,120,88,48,166,51,115,72,111],
    [98,142,42,156,75,129,62,123,65,77,19,82,137,38,149,8],
    [3,87,165,61,135,47,147,33,102,4,31,164,144,59,173,78],
    [54,130,10,103,28,37,106,5,35,20,108,92,12,124,44,131]
  ];

window.addEventListener("load",function(event) {
  document.querySelector('#genNotes').onclick = generateNotes
  document.querySelector('#randomise').onclick = randomise
  document.querySelector('#play').onclick = playGeneratedNotes
  prepareMeasureGrid(MeasureGrid)
  // highlight selected numbers
  const dice_numbers = document.querySelectorAll("div.dice-num")
  for (const dice_num of dice_numbers) {
    dice_num.addEventListener('click', function(event) {
      var kol_id = event.target.dataset.col
      // de-select any selected numbers in the same column
      for( const dice_col of document.querySelectorAll('div.kol-' + kol_id)) {
        if(event.target.id !== dice_col.firstChild.id){
          dice_col.firstChild.classList.remove('dice-num-selected')
        }
      }
      // select the clicked number
      event.target.classList.add('dice-num-selected')
    })
  }
}, false)

function generateNotes(e) {
  score.clear()
  arrangeTune()
  score.tempo = 80
  score.meter = '3/4'
  score.title = "Musikalisches Würfelspiel"
  // display music
  score.render();
}

function prepareMeasureGrid(grid) {
  var element = document.querySelector("#measure-grid");
  if (!element) {
    return;
  }
  var contents = createGrid(grid);
  element.innerHTML = contents;
}

function createGrid(grid) {
  // create an 11x16 grid using values from the measureGrid array
  // (11 cos you cannot roll a 1 with 2 dice)

  // check for mobile, and adjust layout of grid accordingly
  var rowCount = ''
  if(window.screen.width < 500){
    rowCount = 'row-cols-4'
  }

  var row, col;
  var output = "<div class='dice-grid'>";

  for (row=0; row<11; row++) {
    output += `<div class='row ${rowCount} mb-4 mb-md-2' id='row-${row}'>`;
    for (col=0; col<16; col++) {
      output += `<div class='px-2 col kol-${col}'>`;
      if(row === 0){
        output += `<div class='px-1 dice-num dice-num-selected rounded-1' id='col${col}row${row}' data-col=${col}>`
      } else {
        output += `<div class='px-1 dice-num rounded-1' id='col${col}row${row}' data-col=${col}>`
      }
      // add measure number to grid
      output += grid[row][col];
      output += "</div></div>";
    }
    output += "</div>";
  }
  output += "</div>";
  return output;
}

function rollDice() {
  return Math.floor(Math.random() * 11)
}

function randomise() {
  // first de-select all
  selected = document.querySelectorAll('.dice-num-selected')
  selected.forEach(el => { el.classList.remove('dice-num-selected') })
  // then step through each column, randomly selecting a row using a dice roll
  for (col=0; col<16; col++) {
    var randomNum = rollDice()
    var row = 'col' + col + 'row' + randomNum
    sel = document.getElementById(row)
    sel.classList.add('dice-num-selected')
  }
}

function arrangeTune() {
  // step through each column, and fetch the corresponding measure
  // from the noteTable
  for (col=0; col<16; col++) {
    if(col === 7){
      // use fixed ending for final measure of first section
      var measureNotes = noteTable[177]
      parseNotes(measureNotes.treble, 0)
      parseNotes(measureNotes.bass, 1)
    } else {
      // fetch the column
      var column = document.querySelectorAll('div.kol-' + col)
      // find the selected row in the column
      column.forEach(
        function(col) {
          if(col.querySelector('.dice-num-selected')){
            // grab the number of the selected row
            var num = col.querySelector('.dice-num-selected').innerHTML
            // fetch and parse the measure from the note table
            var measureNotes = noteTable[num]
            parseNotes(measureNotes.treble, 0)
            parseNotes(measureNotes.bass, 1)
          }
        }
      )
    }
  }
}

function parseNotes(notes, voice) {
  // step through each note in the measure & add to the Score
  for (var i = 0; i < notes.length; i++) {
    // if the notes are in an array, we have a chord
    if (Array.isArray(notes[i][0])) {
      var chord = notes[i][0]
      var duration = notes[i][1] + 'n'
      score.addNote(chord, duration, voice)
    }
    // a string means we have a single note
    if (typeof notes[i][0] === 'string') {
      var pitch = notes[i][0]
      var duration = notes[i][1] + 'n'
      score.addNote(pitch, duration, voice)
    }
    // and a number means we have a rest
    if (typeof notes[i][0] === 'number') {
      var duration = notes[i][0] + 'n'
      score.addNote('z', duration, voice)
    }
  }
}

{% include_relative music/dice.js %}