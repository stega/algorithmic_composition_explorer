class Score {

  constructor(title){
    this.score      = [[],[]]
    this.title      = title
    this.meter      = "4/4"
    this.noteLength = "1/8"
    this.tempo      = "120"
    this.key        = ""
    this.bars       = false
  }

  addNote(pitch, duration, voice = 0) {
    this.score[voice].push({pitch:pitch, duration:duration})
  }

  concat(score) {

  }

  clear() {
    this.score = [[],[]];
  }

  // export score as text - used for Markov
  // takes the notes of the first voice and creates a string
  // could make more flexible by adding voice param, but not currently needed
  scoreAsText() {
    var txt = ""
    // add the first voices notes to output
    for(const [index,event] of this.score[0].entries()) {
      txt += event.pitch + event.duration + ' '
    }
    return txt
  }

  // ---------------------------
  // exports score in ABC format
  // ---------------------------
  toABC() {
    // start with meta-data
    var abcString = "X:1\n";
    abcString +="L:1/8\n"
    abcString +="T:" + this.title + "\n"
    abcString +="M:" + this.meter + "\n"
    abcString +="Q:" + this.tempo + "\n"
    abcString +="L:" + this.noteLength + "\n"
    abcString +="K:" + this.key + "\n"

    for(const [i,voice] of this.score.entries()) {
      if(voice.length > 0) {
        abcString += "[V:" + i + " clef=" + this.getClef(voice) + "] "
        for(const [index,event] of voice.entries()) {
          // limit to 20 notes per line to keep things readable
          if(index > 0 && index % 20 == 0) {
            abcString += '|'
            abcString += '\n'
          }
          abcString += event.pitch + event.duration
        }
        // add double bar line to end
        abcString += '||'
        abcString += '\n'
      }
    }
    // console.log(abcString)
    return abcString
  }

  getClef(notes) {
    // use bass clef if more than 50% notes are down an octave
    var bassNotes = 0
    for(var note of notes) {
      (note.pitch.endsWith(',')) && bassNotes++
    }
    return (bassNotes > (notes.length/2)) ? 'bass' : 'treble'
  }

  hasNotes() {
    if(this.score.length == 0) { return false };
    return true;
  }

  render() {
    window.ABCJS.renderAbc("staff", this.toABC(), {staffwidth: 700});
    if( this.hasNotes() ) {
      document.querySelector('.modal-footer').hidden = false;
    }
  }

  // NOT USED, but leaving here for now cos could be useful for testing
  // renderABC(abc) {
  //   window.ABCJS.renderAbc("staff", abc, {staffwidth:700});
  //   document.querySelector('.modal-footer').hidden = false;
  // }
}