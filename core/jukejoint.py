import sys
import time
import datetime
from talktown.game import Game
from talktown.person import Person, PersonExNihilo
import random
from song import songs
from talktown.business import Bar

date_gameplay_begins = (1870, 10, 18)

def get_year_gameplay_begins():
  return date_gameplay_begins[0]

def get_year_gen_starts():
  return Game().config.date_worldgen_begins[0]

def establish_setting(emitter=None):
  # Have TOTT do its thing.
  tott_instance = Game(emitter)
  tott_instance.ordinal_date_that_gameplay_begins = ( datetime.date(*date_gameplay_begins).toordinal() )
  tott_instance.establish_setting()
  tott_instance.enact_no_fi_simulation()

  # Rig the generation of the city to always have 3 bars.
  while not tott_instance.city.businesses_of_type('Bar'):
    owner = tott_instance._determine_who_will_establish_new_business(business_type=Bar)
    Bar(owner=owner)

  #Rig the city to have a bar with two people in it
  num_people_to_target = 2
  oldest_bar_in_town = min(tott_instance.city.businesses_of_type('Bar'), key=lambda b: b.founded)
  if len(oldest_bar_in_town.people_here_now) > num_people_to_target:
      for person in list(oldest_bar_in_town.people_here_now)[num_people_to_target:]:
          person.go_to(person.home, 'home')
  while len(oldest_bar_in_town.people_here_now) < num_people_to_target:
      adults_in_town = [p for p in tott_instance.city.residents if p.adult]
      random.choice(adults_in_town).go_to(oldest_bar_in_town, 'leisure')
  chosen_bar = oldest_bar_in_town

  return {
    'personA': list(chosen_bar.people_here_now)[0],
    'personB': list(chosen_bar.people_here_now)[1],
    'bar name': chosen_bar.name,
    'bar founded': chosen_bar.founded,
    'city name': tott_instance.city.name
  }

def establish_monologue(artist_name, people_here_now):
  current_song = [song for song in songs if song.artist_name == artist_name][0]
  current_song.reset() # in case this is a replay through of the game.
  continue_song = True
  patrons = [people_here_now[0], people_here_now[1]]

  # Modify TOTT's People to keep some additional state.
  def make_decision(self):
    self.made_decision = True

  Person.make_decision = make_decision
  PersonExNihilo.make_decision = make_decision

  for person in people_here_now:
      person.mind.made_decision = False
      person.mind.explicit_thoughts = []

  #Loop through song lyrics
  while continue_song:

    #Play the next section of the song, unless the song is over.
    try:
      current_song.play_next_section()

      #Everyone in the bar will consider the song lyrics.
      for person in people_here_now:
        stimuli = person.mind.associate(current_song)
        thought = person.mind.elicit_thought(stimuli)
        if thought:
          thought.execute()
          person.mind.explicit_thoughts.append(thought.realize().lstrip())
          person.mind.thoughts.append(thought)
          if person.mind.made_decision:
              people_here_now.remove(person)
              if len(people_here_now) == 0:
                continue_song = False
        else:
          person.mind.explicit_thoughts.append('...')

    except StopIteration:
      continue_song = False

  return {
    'personA thoughts': patrons[0].mind.explicit_thoughts,
    'personB thoughts': patrons[1].mind.explicit_thoughts,
    'song sections': current_song.get_section_lyrics()
  }
