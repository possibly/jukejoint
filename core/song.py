import os

class Song(object):

  def __init__(self, name):
    self.name = name
    self.artist_name = name[name.find('by')+3:]
    self.sections = []
    self.current_section = None
    self.current_theme = None
  
  def add_section(self, section):
    self.sections.append(section)

  def play_next_section(self):
    if self.current_section is None:
      self.current_section = enumerate(self.sections)

    try:
      current_section = self.current_section.next()
    except StopIteration:
      self.stop()
      raise StopIteration

    self.current_theme = current_section[1].theme

  def stop(self):
    try:
      self.current_section.next()
    except StopIteration:
      # print "\nThe song is over. The jukebox's lights continue to blink expectantly.\n"
      pass
    else:
      # print '\nThe jukebox comes to a dead stop mid-lyric. The silence sounds deafening compared to the music that filled the air previously.\n'
      pass
    self.current_section = None

  @property
  def signals(self):
    """Return the current theme."""
    return [(self.current_theme, 1)]

class Section(object):

  def __init__(self, lines=None, theme=None):
    self.lines = lines or []
    self.theme = theme

  def add_line(self, string):
    self.lines.append(string)

  def add_theme(self, string):
    self.theme = string

  def display_lines(self):
    return '\n'.join(self.lines)

songs = []
song_directory = os.path.dirname(os.path.realpath(__file__))+'/songs'

for filename in os.listdir(song_directory):
  f = open(song_directory+'/'+filename, 'r')
  content = str(f.read()).split('\n')
  
  current_song = Song(name = content[0])
  content = content[2:]

  current_section = Section()
  for line in content:
    if '[' in line:
      current_section.add_theme( line[1:line.find(']')] )
    elif line is '':
      current_song.add_section(current_section)
      current_section = Section()
    elif line is not '' and '[' not in line:
      current_section.add_line(line)

  songs.append(current_song)
