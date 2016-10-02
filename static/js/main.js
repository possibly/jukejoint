function load(){
  toggleLogo();

  document.getElementById('top-logo').addEventListener('webkitAnimationEnd', function(){
    toggleNavButtons();
    toggleC();
    socket.on('loading prepared', prepareGameLoading);
    socket.emit('game loading');
  });
}

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

function toggleC(){
  var c = document.getElementById('c');
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

function prepareIntro(dialogueIntroTemplate){
  document.getElementById('c').innerHTML = dialogueIntroTemplate;
  setTimeout(function(){
    toggleC();
    toggleGameBorder();
    toggleGlowContainer('upholstery', '');
  }, 700)
}
