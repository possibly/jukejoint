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
  print str(request.sid) + " connected"

@socketio.on('load')
def load():
  print "loading jj"
  info = jukejoint.establish_setting()
  print "----"
  db[request.sid]['personA'] = info['personA']
  db[request.sid]['personB'] = info['personB']
  emit('load ready', {'data': {
    'personA': info['personA'].name,
    'personB': info['personB'].name,
    'bar name': info['bar name'],
    'bar founded': info['bar founded'],
    'city name': info['city name']
  }}, room=request.sid)
  print "emit load ready"

@socketio.on('song selection')
def song_selection(artist_name):
  print "song selection"
  personA = db[request.sid]['personA']
  personB = db[request.sid]['personB']
  people_here_now = [personA, personB]
  thoughts = jukejoint.establish_monologue(artist_name, people_here_now)
  emit('song ready', {'data': thoughts}, room=request.sid)
  print "monologue/song ready"