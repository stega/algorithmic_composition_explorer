// ---------------------------------------------------
// IMPORT ABC MIXIN
// allows the importing of ABC files into the Score
// used for Markov Chains
// ---------------------------------------------------

let importAbcMixin = {
  importABC(abc) {
    this.title = this.getTitle(abc);
    this.meter = this.getMeter(abc);
    this.tempo = this.getTempo(abc);
    this.key = this.getKey(abc);
    this.importNotes(abc);
  },
  getTitle(abc){
    var reggy = /^T:.+$/gm
    return reggy.exec(abc)[0].split(":")[1];
  },
  getMeter(abc){
    var reggy = /^M:\d\/\d$/gm
    return reggy.exec(abc)[0].split(":")[1];
  },
  getTempo(abc){
    var reggy = /^Q:\d{2,3}$/gm
    return reggy.exec(abc)[0].split(":")[1];
  },
  getKey(abc){
    var reggy = /^K:.+$/gm
    return reggy.exec(abc)[0].split(":")[1];
  },
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
  },
  isNote(str){
    var note_reggy = /[A-Ga-gz]/
    return note_reggy.test(str)
  },
  isOctave(str){
    var note_reggy = /[,']/
    return note_reggy.test(str)
  },
  isAccidental(str){
    var note_reggy = /^[_=^]/
    return note_reggy.test(str)
  },
  isDuration(str){
    var num_reggy = /[0-9\/]/
    return num_reggy.test(str)
  }
}