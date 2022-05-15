class Score {

  constructor(title){
    this.score      = [[],[]]
    this.title      = title
    this.meter      = "4/4"
    this.noteLength = "1/8"
    this.tempo      = "120"
    this.key        = "C"
    this.lengthTable = this.buildLengthTable();
  }

  addNote(pitch, duration, voice = 0) {
    var time = this.getCurrentTime(voice)
    this.score[voice].push({time:time.toBarsBeatsSixteenths(), pitch:pitch, duration:duration})
  }

  // Applies the key sig to the notes in the score
  applyKey(){
    var scale = Tonal.Scale.get(this.key).notes
    this.score.forEach(voice => {
      voice.forEach(event => {
        // don't try and transpose rests!
        if(event.pitch !== 'z'){
          // if we have a chord
          if(Array.isArray(event.pitch)){
            var chord = []
            event.pitch.forEach(note => {
              var currentNote = Tonal.Note.get(note)
              var scaleNote = Tonal.Note.get(scale.find(element => element.startsWith(currentNote.letter)))
              note = currentNote.letter + scaleNote.acc + currentNote.oct
              chord.push(this.pitchToABC(note))
            })
            event.pitch = chord
          } else {
            var currentNote = Tonal.Note.get(event.pitch)
            var scaleNote = Tonal.Note.get(scale.find(element => element.startsWith(currentNote.letter)))
            event.pitch = currentNote.letter + scaleNote.acc + currentNote.oct
          }
        }
      })
    })
  }

  // gets current time of score in bars:beats
  // used for inserting notes at the correct time
  // in the score
  getCurrentTime(voice){
    if(this.score[voice].length === 0){
      return Tone.Time('0:0:0')
    } else {
      var previousEvent = this.score[voice][this.score[voice].length-1]
      var duration = Tone.Time(previousEvent.duration)
      var oldTime = Tone.Time(previousEvent.time)
      var newTime = Tone.Time(oldTime + duration)
      return newTime
    }
  }

  // returns the duration of the score in milliseconds
  getDuration(){
    return this.getCurrentTime(0).toMilliseconds()
  }

  // remove all notes from the score
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
      txt += event.pitch + ':' + event.duration + ' '
    }
    return txt
  }

  scoreAsMIDI() {
    // create a new midi file
    var midi = new Midi()
    this.score.forEach(voice => {
      // add a track
      var track = midi.addTrack()
      voice.forEach(event => {
        track.addNote({
          midi: event.pitch,
          time: Tone.Time(event.time).toMilliseconds(),
          duration: Tone.Time(event.duration).toMilliseconds(),
        })
      })
    })
    return midi
  }

  // ---------------------------
  // exports score in ABC format
  // ---------------------------
  toABC() {
    // start with meta-data
    var abcString = "X:1\n";
    abcString +="T:" + this.title + "\n"
    abcString +="M:" + this.meter + "\n"
    abcString +="Q:" + this.tempo + "\n"
    abcString +="L:" + this.noteLength + "\n"
    abcString +="K:" + this.key + "\n"

    Tone.Transport.bpm.value = Number(this.tempo)
    Tone.Transport.timeSignature = this.meter[0]

    for(const [i,voice] of this.score.entries()) {
      if(voice.length > 0) {
        abcString += "[V:(" + i + ") clef=" + this.getClef(voice) + "] "
        var staveLength = Tone.Time(0)
        var measureCount = 0
        var oneMeasure = Tone.Time('1m').toMilliseconds()

        for(const [index,event] of voice.entries()) {
          if(event.pitch == 'z'){
            // if we have a rest
            abcString += 'z' + this.lengthTable[event.duration]
          } else if(Array.isArray(event.pitch)){
            // if we have a chord
            var len = this.lengthTable[event.duration]
            var chord = "["
            event.pitch.forEach(n => {
              var note = Tonal.Note.get(n)
              note = note.letter + note.oct
              chord += this.pitchToABC(note)
            })
            chord += "]"
            abcString += chord + len
          } else {
            // remove sharps / flats, as ABC gets this info from the key
            var note = Tonal.Note.get(event.pitch)
            note = note.letter + note.oct
            abcString += this.pitchToABC(note) + this.lengthTable[event.duration]
          }

          // limit to 20 notes per line to keep things readable
          staveLength = Tone.Time(Tone.Time(event.duration) + Tone.Time(staveLength))

          if(Tone.Time(staveLength).toMilliseconds() >= oneMeasure){
            abcString += '|'
            staveLength = Tone.Time(0)
            measureCount += 1
          }
          if(measureCount > 0 && measureCount % 4 == 0) {
            abcString += '\n'
            measureCount = 0
          }

        }
        // add double bar line to end
        if(staveLength.toString() !== 0){ abcString += '||' }
      }
    }
    return abcString
  }

  // returns the appropriate clef for the notes passed in
  getClef(notes) {
    // use bass clef if more than 50% notes are down an octave
    var bassNotes = 0
    if(!Array.isArray(notes)){
      for(var note of notes) {
        (note.pitch.endsWith('2')) && bassNotes++
      }
    }
    return (bassNotes > (notes.length/2)) ? 'bass' : 'treble'
  }

  // checks for an empty score
  hasNotes() {
    if(this.score[0].length == 0) { return false }
    return true
  }

  // render score as notation using ABCjs
  render() {
    // only render everything if we actually have notes to play
    if( this.hasNotes() ) {
      window.ABCJS.renderAbc("staff", this.toABC(), {responsive: 'resize'})
      document.querySelector('.modal-footer').hidden = false
      document.querySelector('#instrument-chooser').hidden = false
    }
  }

  // length table used for mapping tonejs length to ABC notation
  buildLengthTable() {
    return {
      '16n': '/2',
      '16n': '/',
      '8n': '1',
      '4n': '2',
      '4n.': '3/2',
      '3n.': '3',
      '2n': '4',
      '2n.': '6',
      '1m': '8',
      '1m8n': '10'
    };
  }

  pitchToABC(pitch){
    // Tonal doesn't support rests, so handle them here
    if(pitch == 'z'){ // return rest
      return 'z'
    } else { // return pitch
      return Tonal.AbcNotation.scientificToAbcNotation(pitch)
    }

  }

  ABCToPitch(abc){
    return Tonal.AbcNotation.abcToScientificNotation(abc)
  }

  // this does a reverse lookup for dictionaries
  // i.e. it returns the key for a given value in a dictionary
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
}