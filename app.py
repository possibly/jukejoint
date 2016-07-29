from flask import Flask, render_template
from core.jukejoint import JukeJoint

app = Flask(__name__)
db = []

@app.route('/')
def index():
  jj = JukeJoint()
  return render_template('index.html')