function makePiano(delay){
  var piano = new Tone.Sampler({
    urls: {
      'A4': 'A3.mp3',
      'A5': 'A4.mp3',
      'A6': 'A5.mp3',
      'C4': 'C3.mp3',
      'C5': 'C4.mp3',
      'C6': 'C5.mp3',
      'D#4': 'Ds3.mp3',
      'D#5': 'Ds4.mp3',
      'D#6': 'Ds5.mp3',
      'F#4': 'Fs3.mp3',
      'F#5': 'Fs4.mp3',
      'F#6': 'Fs5.mp3'
    },
    baseUrl: "/samples/piano/"
  })
  let verb = new Tone.Reverb(2)
  verb.wet.value = 0.7
  if(delay){
    let echo = new Tone.FeedbackDelay('16n.', 0.4)
    piano.connect(echo.connect(verb))
  } else {
    piano.connect(verb)
  }
  verb.toDestination()
  return piano
}