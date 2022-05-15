function makeSynth(delay){
  // set envelopes
  let envelope = {
    attack: 0,
    decay: 4,
    sustain: 0.2,
    release: 2,
    releaseCurve: 'linear'
  };
  let filterEnvelope = {
    baseFrequency: 260,
    octaves: 2,
    attack: 0,
    decay: 4,
    sustain: 0.2,
    release: 2
  }
  // create poly synth
  var poly = new Tone.PolySynth(Tone.DuoSynth);
  // set oscillators params for polysynth
  poly.set({
    voice0: {
        oscillator: {type: 'sine'},
        envelope,
        filterEnvelope
      },
      voice1: {
        oscillator: {type: 'square'},
        envelope,
        filterEnvelope
      },
      vibratoRate: 0.5,
      vibratoAmount: 0.1
  })
  // setting vol to -10db prevents distortion
  poly.volume.value = -10

  // add effects
  let verb = new Tone.Reverb(4)
  verb.wet.value = 0.75
  if(delay){
    let echo = new Tone.FeedbackDelay('16n.', 0.4)
    poly.connect(echo.connect(verb))
  } else {
    poly.connect(verb)
  }
  // route effects
  verb.toDestination()

  return poly
}
