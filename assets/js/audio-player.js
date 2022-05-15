class AudioPlayer {

  static play(score, instrument){
    // clear any notes from the parts before starting
    parts.length > 0 && parts.forEach(p => {p.clear()})
    // make sure the transport isnt running
    Tone.Transport.stop()
    // step through each voice, and add the notes to the part
    score.score.forEach(s => {
      parts.push(new Tone.Part(function(time, event){
            instrument.triggerAttackRelease(event.pitch, event.duration, time, 0.7)
          }, s).start(0))
    })
    // adjust the tempo based on default note division
    if(score.noteLength.endsWith('4')){ var bpm = score.tempo/2
    } else { var bpm = score.tempo }

    // set the BPM, and start playback
    Tone.Transport.bpm.value = Number(bpm)
    Tone.Transport.start()
    Tone.start()

    // reset the buttons after the score has finished playing
    var timer = setTimeout( function() {
      resetPlaybackButtons()
    }, score.getDuration());

    // assign stop buttons, so they stop the transport
    let stopBtns = document.querySelectorAll('.stop-button');
    stopBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        Tone.Transport.stop()
        // cancel the timer set above, as its no longer needed
        clearTimeout(timer)
        // reset the buttons
        resetPlaybackButtons()
      })
    })
  }
}
