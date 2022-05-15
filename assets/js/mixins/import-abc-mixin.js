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
    this.key = this.getKey(abc)
    this.importNotes(abc);
    this.applyKey()
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
    var key = reggy.exec(abc)[0].split(":")[1];
    if(key.endsWith('m')){
      var scaleType = ' minor'
    } else {
      var scaleType = ' major'
    }
    return key + scaleType
  },
  importNotes(abc){
    // extract notes from ABC file
    var voices = []
    var isChord = false
    var chordNotes = []
    var chordLen = ''

    if(abc.match(/\[V:\d\]/)){
      // we have voices
      var voice1reggy = /(?:\[V:1\]).*/
      var voice2reggy = /(?:\[V:2\]).*/
      var voice1 = voice1reggy.exec(abc)[0].replace('[V:1]','')
      var voice2 = voice2reggy.exec(abc)[0].replace('[V:2]','')

      var reggy        = /^(?![A-Za-z]:)[A-Ga-g|\(]/gm
      voice1 = voice1.substring(voice1.search(reggy))
      voice2 = voice2.substring(voice2.search(reggy))

      voices.push(voice1.trim())
      voices.push(voice2.trim())
    } else {
      // we have a single voice
      var reggy        = /^(?![A-Za-z]:)[A-Ga-g|\(]/gm
      var notes_string = abc.substring(abc.search(reggy))
      voices.push(notes_string)
    }

    // The following logic extracts pitch and duration for each note.
    // See https://abcwiki.org/abc:syntax for ABC syntax.
    for(var v = 0; v < voices.length; v++){
      var notes_string = voices[v]
      for(var i = 0; i < notes_string.length; ++i){
        var note = ""
        var len  = ""

        if(this.isAccidental(notes_string[i])){
          note += notes_string[i]
          i++
        }
        if(this.isChordStart(notes_string[i])){
          isChord = true
          continue
        }
        if(this.isChordEnd(notes_string[i])){
          isChord = false
          this.addNote(chordNotes, chordLen, v);
          chordNotes = []
          continue
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

          if(isChord == true){
            note = this.ABCToPitch(note)
            chordNotes.push(note)
            key = this.getKeyByValue(this.lengthTable, len);
            chordLen = key
            continue
          }
          // reverse lookup for the length table
          // get Tone.js value from ABC length
          key = this.getKeyByValue(this.lengthTable, len);
          note = this.ABCToPitch(note)
          if(note == ''){
            note = 'z'
          } else {
            this.addNote(note, key, v);
          }
        }
      } // end notes string loop
    } // end voice loop
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
  },
  isChordStart(str){
    return str.match(/\[/)
  },
  isChordEnd(str){
    return str.match(/\]/)
  },
}