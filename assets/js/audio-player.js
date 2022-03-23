
// TODO: change this to use Tone.js
class AudioPlayer {

  static play(abc) {
    let notes = ABCJS.renderAbc("*", abc)[0];
    let synth = new ABCJS.synth.CreateSynth();
    synth.init({
      visualObj: notes
      // millisecondsPerMeasure: 2500
    }).then(function (response) {
      // response contains the list of notes that were loaded
      // synth.prime builds the output buffer
      return synth.prime();
    }).then(function () {
      // We are now ready to play!
      synth.start();
      return Promise.resolve();
    }).catch(function (error) {
      console.warn("synth error", error);
    });

    let stopBtns = document.querySelectorAll('.stop-button');
    stopBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        if (synth)
          synth.stop();
      })
    })
  }
}
