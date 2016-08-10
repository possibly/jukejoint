var transition_index = 0;
var transition_scenes = ['title-screen', 'game-loading', 'dialogue-intro', 'song-selection', 'monologues'];

function transition(){
  var currentlyAt = transition_scenes[transition_index];
  if (transition_index+1 == transition_scenes.length){
    transition_index = 0;
  }else{
    transition_index += 1;
  }
  var toBeAt = transition_scenes[transition_index];

  document.getElementById(currentlyAt).style.display = 'none';
  document.getElementById(toBeAt).style.display = 'block';
}

function load(){
  socket.on('loading prepared', prepareGameLoading);
  socket.emit('game loading');
}

function prepareGameLoading(gameLoadingTemplate){
  document.getElementById('game-loading').innerHTML = gameLoadingTemplate;
  transition();
  socket.on('tott_lo_fi_event', updateLoadBar);
  socket.on('setting established', function(){socket.emit('intro loading')});
  socket.on('intro prepared', prepareIntro)
  socket.emit('establish setting');
}

function prepareIntro(dialogueIntroTemplate){
  document.getElementById('dialogue-intro').innerHTML = dialogueIntroTemplate;
  document.getElementById('loading-continue').children[0].disabled = false;
}

function updateLoadBar(tott_event){
  document.getElementById('load-bar').innerHTML = tott_event;
}

function selectSong(artist_name){
  socket.on('song ready', songReady);
  socket.emit('song selection', artist_name);
}

function songReady(template){
  document.getElementById('monologues').innerHTML = template;
  transition();
}