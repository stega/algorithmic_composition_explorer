var score  = new Score("Tintinnabuli")

window.onload = (event) => {
  document.querySelector('#genNotes').onclick  = generateNotes
  document.querySelector('#play').onclick = playGeneratedNotes
  // document.querySelector('#order').oninput = updateOrder
  // document.querySelector('#bpm').oninput = updateBPM
  // document.querySelector('button#tune1').onclick = play
  // document.querySelector('button#tune2').onclick = play
  // document.querySelector('button#tune3').onclick = play
  // document.querySelector('button#tune4').onclick = play
  // document.querySelector('button#tune5').onclick = play
  // document.querySelector('button#tune6').onclick = play
}
