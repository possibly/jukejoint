function toggleLogo() {
  var bricks = document.getElementById('logo-bricks-container');
  if (!bricks.classList.contains('flicker-bricks-off') && !bricks.classList.contains('flicker-bricks-on')){
    bricks.classList.add('flicker-bricks-off');
  } else {
    bricks.classList.toggle('flicker-bricks-off');
    bricks.classList.toggle('flicker-bricks-on');
  }

  var topLogo = document.getElementById('top-logo');
  var bottomLogo = document.getElementById('bottom-logo');
  if (topLogo.classList.contains('red') && bottomLogo.classList.contains('blue')){
    topLogo.classList.remove('red');
    topLogo.classList.add('flicker-logos-off-red');
    bottomLogo.classList.remove('blue');
    bottomLogo.classList.add('flicker-logos-off-blue');
  } else {
    topLogo.classList.toggle('flicker-logos-off-red');
    topLogo.classList.toggle('flicker-logos-on-red');
    bottomLogo.classList.toggle('flicker-logos-off-blue');
    bottomLogo.classList.toggle('flicker-logos-on-blue');
  }
}

function toggleNavButtons(){
  var buttons = document.getElementsByClassName('pac-font');
  Array.prototype.map.call(buttons, function(button){
    button.classList.toggle('pac-font-color-on');
    button.classList.toggle('pac-font-color-off');
  });
  document.getElementById('play-button').disabled = true;
}

function toggleC(flickerObj){
  var c;
  if (flickerObj){ c = document.getElementById(flickerObj); }
  else { c = document.getElementById('c'); }

  if (c.classList.contains('c-off')){
    c.addEventListener('webkitAnimationEnd', function(){
      c.classList.remove('c-flicker');
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    c.classList.remove('c-off');
    c.classList.add('c-on');
    c.classList.add('c-flicker');
  }
  else if (c.classList.contains('c-on')){
    c.addEventListener('webkitAnimationEnd', function(){
      c.classList.add('c-off');
      c.classList.remove('c-flicker');
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    c.classList.remove('c-on');
    c.classList.add('c-flicker');
  }
}

function toggleGameBorder(){
  var gc = document.getElementById('glow-container');
  if (gc.classList.contains('glow-container-off')){
    gc.addEventListener('webkitAnimationEnd', function(){
      gc.classList.add('glow-container-on');
      gc.classList.remove('glow-container-flicker-on');
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    gc.classList.remove('glow-container-off');
    gc.classList.add('glow-container-flicker-on');
  } else {
    gc.addEventListener('webkitAnimationEnd', function(){
      gc.classList.add('glow-container-off');
      gc.classList.remove('glow-container-flicker-off');
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    gc.classList.remove('glow-container-on');
    gc.classList.add('glow-container-flicker-off');
  }
}

function toggleGlowContainer(bgStyle, adStyle){
  var ad = document.getElementById('c');
  var gcbc = document.getElementById('glow-container-bricks-container');
  if (bgStyle){ gcbc.classList.add(bgStyle); }

  if (gcbc.classList.contains('glow-container-bricks-off')){
    gcbc.addEventListener('webkitAnimationEnd', function(){
      gcbc.classList.remove('glow-container-bricks-flicker-on');
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    gcbc.classList.remove('glow-container-bricks-off');
    gcbc.classList.add('glow-container-bricks-on');
    gcbc.classList.add('glow-container-bricks-flicker-on');
    ad.classList.add(adStyle);
  } else {
    gcbc.addEventListener('webkitAnimationEnd', function(){
      gcbc.classList.remove('glow-container-bricks-on');
      gcbc.classList.add('glow-container-bricks-off');
      gcbc.classList.remove('glow-container-bricks-flicker-off');
      ad.classList.remove(adStyle);
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    gcbc.classList.add('glow-container-bricks-flicker-off');
  }
}

function toggleProceedButton(){
  var proceedBtn = document.getElementById('proceed');
  if (proceedBtn.classList.contains('proceed-off')){
    proceedBtn.addEventListener('webkitAnimationEnd', function(){
      proceedBtn.classList.remove('fade-in');
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    proceedBtn.classList.remove('proceed-off');
    proceedBtn.classList.add('fade-in');
  } else {
    proceedBtn.addEventListener('webkitAnimationEnd', function(){
      proceedBtn.classList.remove('fade-out');
      proceedBtn.classList.add('proceed-off');
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    proceedBtn.classList.add('fade-out');
  }
}

function setProceedButton(text, fn){
  document.getElementById('proceed').innerHTML = text;
  document.getElementById('proceed').onclick = fn;
}

function load(){
  toggleLogo();

  document.getElementById('top-logo').addEventListener('webkitAnimationEnd', function(){
    toggleNavButtons();
    toggleC();
    socket.on('loading prepared', prepareGameLoading);
    socket.emit('game loading');
  });
}

function prepareGameLoading(gameLoadingTemplate){
  var c = document.getElementById('c')
  c.innerHTML = gameLoadingTemplate;
  c.addEventListener('webkitAnimationEnd', function(){
    setTimeout(function(){
      socket.on('tott_lo_fi_event', updateLoadBar);
    }, 1200)
    this.removeEventListener('webkitAnimationEnd', arguments.callee);
  });
  socket.on('setting established', function(){
    setProceedButton('Proceed >', function(){
      toggleProceedButton();
      toggleC();
      document.getElementById('c').addEventListener('webkitAnimationEnd', function(){
        socket.on('outside bar ready', prepareOutsideBar);
        socket.emit('outside bar');
        this.removeEventListener('webkitAnimationEnd', arguments.callee);
      });
    })
    toggleProceedButton();
  });
  socket.emit('establish setting');
}

function updateLoadBar(tott_event){
  document.getElementById('load-bar').innerHTML = tott_event;
}

function prepareOutsideBar(outsideBarTemplate, proceedText){
  var c = document.getElementById('c');
  setProceedButton(proceedText, function(){
    toggleProceedButton();
    document.getElementById('c').addEventListener('webkitAnimationEnd', function(){
      socket.on('intro prepared', prepareIntro);
      socket.emit('intro loading');
      this.removeEventListener('webkitAnimationEnd', arguments.callee);
    });
    toggleC();
    toggleGameBorder();
    toggleGlowContainer('bricks', 'c-brick-bar-ad');
  });
  c.addEventListener('webkitAnimationEnd', function(){
    setTimeout(toggleProceedButton, 1500);
    this.removeEventListener('webkitAnimationEnd', arguments.callee);
  });
  c.innerHTML = outsideBarTemplate;
  setTimeout(function(){
    toggleC();
    toggleGameBorder();
    toggleGlowContainer('bricks', 'c-brick-bar-ad');
  }, 300)
}

function dialogueObject(name, line){ return {'speaker': name, 'line': line} }

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var personVizMale = ['A', 'D', 'F', 'H', 'J', 'K', 'M'];
var personVizFemale = ['B', 'E'];
var personVizAndrogenous = ['C', 'G', 'I', 'L'];

var dialogueScript = {
  'next': function(){
      this['_index'] += 1;
      return this.data[this['_index']-1];
    },
  'peek': function(){
      var ndObject = this.next();
      this['_index'] -= 1;
      return ndObject;
    },
  'previous': function(){ 
    if ( this['_index'] == 0 ){ return dialogueObject(); }
    return this.data[this['_index']-1]; 
  },
  '_index': 0,
  'data':[
    dialogueObject('Jukebox', ''),
    dialogueObject('Jukebox', 'Krmmph'),
    dialogueObject('Jukebox', 'Click.'),
    dialogueObject('Jukebox', 'Pop.'),
    dialogueObject('name_a', "That machine's got a mind of its own!"),
    dialogueObject('name_b', "Maybe...it's haunted..."),
    dialogueObject('Jukebox', 'Click.'),
    dialogueObject('Jukebox', 'Krmmph.'),
    dialogueObject('Jukebox', 'Pop.'),
    dialogueObject('name_a', "It's been playing songs all by itself!"),
    dialogueObject('Jukebox', 'Bzzzzzzz.'),
    dialogueObject('name_a', "(You've got to come to a decision...Do you stay here...or do you go?)"),
    dialogueObject('name_b', "(I really need to figure this out, and figure it out now. I just don't know if I can leave this town.)"),
    dialogueObject('Jukebox', 'Bzzzzzzzzzzzzzzzzzzzzzzzzz.'),
    dialogueObject('Jukebox', 'Bzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz.')
  ]
}

function chooseGenderedIcon(gender){
  if (getRandomIntInclusive(0, 1) == 0){
    return personVizAndrogenous[getRandomIntInclusive(0, personVizAndrogenous.length-1)];
  } else if (gender == 'female'){ 
    return personVizFemale[getRandomIntInclusive(0, personVizFemale.length-1)]; 
  } else {
    return personVizMale[getRandomIntInclusive(0, personVizMale.length-1)]; 
  }
}

function updateDialogueScript(nameA, nameB, genderA, genderB){
  var personAViz = chooseGenderedIcon(genderA);
  var personBViz = chooseGenderedIcon(genderB);

  dialogueScript.data = dialogueScript.data.map(function(dObject){
    if (dObject.speaker == 'name_a'){
      dObject.speaker = nameA;
      dObject.viz = personAViz;
    }
    else if(dObject.speaker == 'name_b'){
      dObject.speaker = nameB; 
      dObject.viz = personBViz;
    }
    return dObject;
  });
}

function displayDialogue(){
  var jukebox = document.getElementById('jukebox');
  var person = document.getElementById('person');
  var line = document.getElementById('line');
  var previousSpeaker = dialogueScript.previous().speaker;
  var nextDialoguePiece = dialogueScript.next();
  
  if (nextDialoguePiece.speaker == 'Jukebox'){
    jukebox.style.display = 'block';
    person.style.display = 'none';
  } else {
    var personViz = document.getElementById('person-viz');
    var personName = document.getElementById('person-name');
    jukebox.style.display = 'none';
    person.style.display = 'block';
    personName.innerHTML = nextDialoguePiece.speaker;
    personViz.innerHTML = nextDialoguePiece.viz;
  }

  if (previousSpeaker == nextDialoguePiece.speaker){
    line.innerHTML += '<br>' + nextDialoguePiece.line;
  } else {
    line.innerHTML = nextDialoguePiece.line
  }
}

function prepareIntro(dialogueIntroTemplate, nameA, nameB, genderA, genderB){
  var c = document.getElementById('c');
  setProceedButton('Next >', function(){
    try{
      displayDialogue();
    }catch(e){
      c.addEventListener('webkitAnimationEnd', function(){
        socket.on('song selection ready', prepareSongSelection);
        socket.emit('prepare song selection');
        this.removeEventListener('webkitAnimationEnd', arguments.callee);
      });
      toggleC();
      toggleProceedButton();
      toggleGameBorder();
    }
  });
  c.addEventListener('webkitAnimationEnd', function(){
    setTimeout(toggleProceedButton, 300);
    this.removeEventListener('webkitAnimationEnd', arguments.callee);
  });
  c.innerHTML = dialogueIntroTemplate;
  updateDialogueScript(nameA, nameB, genderA, genderB);
  setTimeout(function(){
    toggleC();
    toggleGameBorder();
    displayDialogue();
  }, 300)
}

function prepareSongSelection(template){
  var c = document.getElementById('c');
  c.innerHTML = template;
  setTimeout(function(){
    toggleC();
    toggleGameBorder();
  }, 300)
}

function selectSong(artist_name){
  socket.on('song ready', prepareMonologues);
  socket.emit('song selection', artist_name);
  toggleC();
  toggleGameBorder();
}

function prepareMonologues(){
  toggleC();
  toggleGameBorder();
}
