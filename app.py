from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit, join_room
from core import jukejoint
import eventlet

app = Flask(__name__)
db = {}
app.config['SECRET_KEY'] = 'set me in the deployed environment, thanks.'
socketio = SocketIO(app)
"""
Replace Python standard I/O functions with eventlet versions. This is
useful since TOTT may implement event emitters yet remain library agnostic.
"""
eventlet.monkey_patch()

class Emitter():
  def __init__(self, room_id):
    self.room_id = room_id
    self.my_emit = emit

  def emit(self, event, data):
    self.my_emit(event, data, room=self.room_id)

@app.route('/')
def index():
  return render_template('index.html')

@socketio.on('connect')
def connect():
  db[request.sid] = {}
  join_room(request.sid)

@socketio.on('establish setting')
def establish_setting():
  jukejoint_emitter = Emitter(room_id=request.sid)
  info = jukejoint.establish_setting(jukejoint_emitter) # emits tott_lo_fi_event
  db[request.sid]['personA'] = info['personA']
  db[request.sid]['personB'] = info['personB']
  db[request.sid]['bar name'] = info['bar name'].upper()
  db[request.sid]['bar founded'] = info['bar founded']
  db[request.sid]['city name'] = info['city name'].upper()
  emit('setting established')

@socketio.on('intro loading')
def intro_loading():
  emit('intro prepared', render_template('dialogue-intro.html',
    name_a=db[request.sid]['personA'],
    name_b=db[request.sid]['personB'],
    bar_name=db[request.sid]['bar name'],
    bar_founded=db[request.sid]['bar founded'],
    city_name=db[request.sid]['city name']
  ), room=request.sid)

@socketio.on('game loading')
def game_loading():
  emit('loading prepared', render_template('game-loading.html',
    year_gameplay_begins=jukejoint.get_year_gameplay_begins(),
    year_gen_starts=jukejoint.get_year_gen_starts()
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

if __name__ == '__main__':
    socketio.run(app)
