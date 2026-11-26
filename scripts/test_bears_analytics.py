"""Offline regression tests for Bears Intelligence aggregation modules."""
import unittest
from redzone import RedZone, band
from team_identity import TeamIdentity
from defense import Defense, FIELDS
from game_drives import GameDrives

def num(r,k):
    try:return float(r[k])
    except (KeyError,TypeError,ValueError):return None
def play(**overrides):
    return dict({"posteam":"CHI","defteam":"GB","home_team":"CHI","away_team":"GB","game_id":"test","fixed_drive":"1","drive":"1","week":"1","play_id":"1","play_type":"pass","pass_attempt":1,"complete_pass":1,"yards_gained":10,"passing_yards":10,"epa":0.5,"down":1,"yardline_100":20,"air_yards":8,"pass_location":"middle","passer_player_id":"QB","receiver_player_id":"WR"},**overrides)

class AnalyticsTests(unittest.TestCase):
    def test_redzone_boundaries(self):
        self.assertEqual([band(v) for v in (21,20,16,15,11,10,6,5,1,0,None)],[None,"16-20","16-20","11-15","11-15","6-10","6-10","1-5","1-5",None,None])
    def test_redzone_drive_dedup_and_credit(self):
        z=RedZone()
        z.observe(play(),num)
        z.observe(play(play_id="2",yardline_100=10,pass_touchdown=1),num)
        d=z.export({})
        self.assertEqual(d["drives"]["team"],1)
        self.assertEqual(d["drives"]["teamTd"],1)
        wr=next(p for p in d["players"] if p["gsisId"]=="WR")
        self.assertEqual(sum(b["targets"] for b in wr["bands"]),2)
        self.assertEqual(sum(b["recTd"] for b in wr["bands"]),1)
    def test_team_direction_and_missing_epa(self):
        t=TeamIdentity()
        t.observe(play(),num)
        t.observe(play(posteam="GB",defteam="CHI",epa=None,yards_gained=5),num)
        t.observe(play(qb_kneel=1),num)
        d=t.export()
        self.assertEqual(d["offense"]["plays"],1)
        self.assertEqual(d["defense"]["plays"],1)
        self.assertEqual(d["offense"]["epa"],.5)
        self.assertIsNone(d["defense"]["epa"])
        self.assertEqual(d["offense"]["yardsPerPlay"],10)
        self.assertEqual(d["defense"]["yardsPerPlay"],5)
        self.assertEqual(d["offenseRanks"]["yardsPerPlay"]["rank"],1)
        self.assertEqual(d["defenseRanks"]["yardsPerPlay"]["rank"],1)
        profiles=t.matchup_export()
        chi=next(p for p in profiles if p["id"]=="CHI")
        self.assertEqual(chi["styles"]["pass"]["offense"]["plays"],1)
        self.assertEqual(chi["styles"]["rush"]["offense"]["plays"],0)
    def test_sacks_and_non_sack_hits(self):
        cols={f for fs in FIELDS.values() for f in fs}
        d=Defense(cols)
        d.observe(play(posteam="GB",defteam="CHI",sack=1,sack_player_id="D",qb_hit_1_player_id="D"),num)
        d.observe(play(posteam="GB",defteam="CHI",qb_hit_1_player_id="D"),num)
        p=d.export({})["players"][0]
        self.assertEqual(p["totals"]["sacks"],1)
        self.assertEqual(p["totals"]["hits"],1)
        self.assertNotIn("solo",p["totals"])
    def test_half_sack(self):
        d=Defense({f for fs in FIELDS.values() for f in fs})
        d.observe(play(posteam="GB",defteam="CHI",sack=1,half_sack_1_player_id="A",half_sack_2_player_id="B"),num)
        self.assertEqual(sorted(p["totals"]["sacks"] for p in d.export({})["players"]),[.5,.5])
    def test_drive_field_and_turnover(self):
        g=GameDrives()
        g.observe(play(yardline_100=70,yards_gained=12),num)
        g.observe(play(play_id="2",yardline_100=58,yards_gained=0,interception=1),num)
        d=g.export()[0]["drives"][0]
        self.assertEqual(d["snapCount"],2)
        self.assertEqual(d["netYards"],12)
        self.assertEqual(d["plays"][0]["end"],58)
        self.assertIsNone(d["plays"][1]["end"])

if __name__=="__main__":unittest.main()
