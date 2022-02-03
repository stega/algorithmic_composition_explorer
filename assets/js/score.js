class Score {
    
  constructor(){
    this.score = [];
  }

  addNote(pitch, duration) {
    this.score.push(pitch + duration)
    // limit to 12 notes per line to keep things readable
    if(this.score.length % 12 == 0) {
      this.addBarline();
      this.addLinebreak();
    }
  }

  addBarline() {
    this.score.push('|');
  }

  addLinebreak() {
    this.score.push('\n');
  }

  addDoubleBarline() {
    this.score.push('||');
  }

  clear() {
    this.score = [];
  }

  toABC() {
    let abc_string = "";
    for(let event of this.score) {
      abc_string += event
    }
    return abc_string
  }

  hasNotes() {
    if(this.score.length == 0) { return false };
    if(this.score.length == 1 && this.score[0] == "||") { return false };
    return true;
  }

  render() {
    window.ABCJS.renderAbc("staff", this.score.join(' '), {staffwidth: 430});
    if( this.hasNotes() ) {
      document.querySelector('.modal-footer').hidden = false;
    }
  }
}