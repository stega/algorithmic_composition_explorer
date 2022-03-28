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

  // -------------------
  // IMPORT ABC METHODS
  // -------------------
  importABC(abc) {
    this.title = this.getTitle(abc);
    this.meter = this.getMeter(abc);
    this.tempo = this.getTempo(abc);
    this.key = this.getKey(abc);
    this.importNotes(abc);
  }
  getTitle(abc){
    var reggy = /^T:.+$/gm
    return reggy.exec(abc)[0].split(":")[1];
  }
  getMeter(abc){
    var reggy = /^M:\d\/\d$/gm
    return reggy.exec(abc)[0].split(":")[1];
  }
  getTempo(abc){
    var reggy = /^Q:\d{2,3}$/gm
    return reggy.exec(abc)[0].split(":")[1];
  }
  getKey(abc){
    var reggy = /^K:.+$/gm
    return reggy.exec(abc)[0].split(":")[1];
  }
  importNotes(abc){
    // extract notes from ABC file
    var reggy        = /^(?![A-Za-z]:)[A-Ga-g|\(]/gm
    var notes_string = abc.substring(abc.search(reggy))

    // The following logic extracts pitch and duration for each note.
    // See https://abcwiki.org/abc:syntax for ABC syntax.
    for (var i = 0; i < notes_string.length; ++i){
      var note = ""
      var len  = ""

      if(this.isAccidental(notes_string[i])){
        note += notes_string[i]
        i++
      }
      if(this.isNote(notes_string[i])){
        note += notes_string[i]
        if(this.isOctave(notes_string[i+1])){
          i++
          note += notes_string[i]
        }

        if(this.isDuration(notes_string[i+1])){
          len += notes_string[i+1]
          if(this.isDuration(notes_string[i+2])){
            len += notes_string[i+2]
            i++
            if(this.isDuration(notes_string[i+2])){
              len += notes_string[i+2]
              i++
            }
          }
        } else {
          // No duration given, default to 1
          var len = '1'
        }
        this.addNote(note, len)
      }
    }
  }
  isNote(str){
    var note_reggy = /[A-Ga-gz]/
    return note_reggy.test(str)
  }
  isOctave(str){
    var note_reggy = /[,']/
    return note_reggy.test(str)
  }
  isAccidental(str){
    var note_reggy = /^[_=^]/
    return note_reggy.test(str)
  }
  isDuration(str){
    var num_reggy = /[0-9\/]/
    return num_reggy.test(str)
  }
  // -----------------------
  // END IMPORT ABC METHODS
  // -----------------------

  // export score as text for Markov
  // TODO: if we use SPN (or some such), this is where we'd need to convert it back to HH for display
  scoreAsText() {
    var txt = ""
    for(const [i,voice] of this.score.entries()) {
      // check if the current voice has any notes
      if(voice.length > 0) {
        // add the voices notes to output
        // txt += "V:"
        for(const [index,event] of voice.entries()) {
          txt += event.pitch + event.duration + ' '
        }
      }
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
    abcString +="K:" + this.key + "\n"

    var bar_count = 0.0
    var bar = 0
    for(const [i,voice] of this.score.entries()) {
      if(voice.length > 0) {
        abcString += "V:"
        for(const [index,event] of voice.entries()) {
          // keep track of note lengths in order to add bars to score
          // TODO: maybe we dont need to do this? Bar lines are making things look messy
          if(this.bars){
            // get the ABCs note length syntax into a format we can use (a float)
            var note_len = event.duration
            if(note_len == '/2'){
              note_len = '0.5'
            } else if(note_len == '3/2'){
              note_len = '1.5'
            }
            bar_count += parseFloat(note_len)
            if(bar_count > 8){
              bar_count = bar_count - 8
              abcString += '|'
              bar++
              // add line break every 4 bars
              if(bar == 4) {
                abcString += '\n'
                bar = 0
              }
            }
          } else {
            // no barlines, so limit to 20 notes per line to keep things readable
            if(index > 0 && index % 20 == 0) {
              abcString += '|'
              abcString += '\n'
            }
          }
          abcString += event.pitch + event.duration
        }
        // add double bar line to end
        // console.log(abcString)
        abcString += '||'
        abcString += '\n'
      }
    }
    return abcString
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