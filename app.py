from flask import Flask, render_template, session, request
from flask.ext.socketio import SocketIO, emit, join_room
from core import jukejoint
import json

app = Flask(__name__)
db = {}
app.config['SECRET_KEY'] = 'set me in the deployed environment, thanks.'
socketio = SocketIO(app)

@app.route('/')
def index():
  return render_template('index.html')

@socketio.on('connect')
def connect():
  db[request.sid] = {}
  join_room(request.sid)

@socketio.on('load')
def load():
  info = jukejoint.establish_setting()
  print "----"
  db[request.sid]['personA'] = info['personA']
  db[request.sid]['personB'] = info['personB']
  emit('load ready', render_template('dialogue-intro.html',
    name_a=info['personA'],
    name_b=info['personB'],
    bar_name=info['bar name'].upper(),
    bar_founded=info['bar founded'],
    city_name=info['city name'].upper()
  ), room=request.sid)

@socketio.on('song selection')
def song_selection(artist_name):
  personA = db[request.sid]['personA']
  personB = db[request.sid]['personB']
  people_here_now = [personA, personB]
  info = jukejoint.establish_monologue(artist_name, people_here_now)
  emit('song ready', render_template('monologues.html',
    thoughtsA=info['personA thoughts'], 
    thoughtsB=info['personB thoughts'],
    songSections=info['song sections'],
    nameA=db[request.sid]['personA'],
    nameB=db[request.sid]['personB']
  ), room=request.sid)