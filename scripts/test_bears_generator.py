"""Exercise generator with offline input, including classified passing."""
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("bears_generator", Path(__file__).with_name("build-bears-analytics.py"))
generator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(generator)

class GeneratorTests(unittest.TestCase):
    def test_invalid_profile_fields(self):
        self.assertEqual(generator.roster_profile({"height":"NA","weight":"999","birth_date":"invalid","college":"NA"}), {"heightInches":None,"weightLbs":None,"birthDate":None,"college":None})

    def test_classified_pass_and_roster_export(self):
        play = dict.fromkeys("season_type posteam week passer_player_id pass_attempt complete_pass interception pass_touchdown passing_yards air_yards pass_location epa third_down_converted third_down_failed down ydstogo two_point_attempt play_type rush_attempt rusher_player_id rushing_yards rush_touchdown run_location run_gap qb_kneel receiver_player_id receiving_yards yards_after_catch first_down_pass defteam yards_gained qb_spike fumble_lost sack yardline_100 game_id drive home_team away_team play_id fixed_drive".split(), "")
        play.update(season_type="REG", posteam="CHI", defteam="DET", week="1", passer_player_id="QB", receiver_player_id="WR", pass_attempt="1", complete_pass="1", passing_yards="12", receiving_yards="12", air_yards="10", pass_location="middle", epa="0.5", play_type="pass", down="1", ydstogo="10", yards_gained="12", yardline_100="50", game_id="test", drive="1", fixed_drive="1", play_id="1", home_team="CHI", away_team="DET")
        roster = [{"gsis_id":"QB","espn_id":"123","team":"CHI","full_name":"Test QB","jersey_number":"18","position":"QB","height":"73","weight":"226","birth_date":"2001-11-18","college":"USC"}]
        def load(tag, name):
            if tag == "pbp": return [play], None
            if tag == "rosters": return roster, None
            raise OSError("No fixture depth chart")
        cwd = Path.cwd()
        with tempfile.TemporaryDirectory() as temp:
            try:
                os.chdir(temp)
                with patch.object(generator, "load", side_effect=load):
                    generator.run(2026)
                data = json.loads(Path("public/data/bears-intelligence/2026.json").read_text())
                self.assertEqual(data["players"][0]["passing"][4]["attempts"], 1)
                self.assertEqual(data["roster"][0]["gsisId"], "QB")
                self.assertEqual(data["roster"][0]["profile"], {"heightInches":73,"weightLbs":226,"birthDate":"2001-11-18","college":"USC"})
            finally:
                os.chdir(cwd)
