"""Red-zone aggregation: snap position, not target location."""
from collections import defaultdict

BANDS = ("16-20", "11-15", "6-10", "1-5")

def band(y):
    if y is None or not 1 <= y <= 20:
        return None
    return BANDS[0] if y > 15 else BANDS[1] if y > 10 else BANDS[2] if y > 5 else BANDS[3]

def counters():
    return {"pass": 0, "rush": 0, "passTd": 0, "rushTd": 0, "epaSum": 0.0, "epaCount": 0}

class RedZone:
    def __init__(self):
        self.team = defaultdict(counters)
        self.league = defaultdict(counters)
        self.players = defaultdict(lambda: defaultdict(lambda: {"passAttempts":0,"passTd":0,"carries":0,"rushTd":0,"targets":0,"receptions":0,"recTd":0}))
        self.drives = set()
        self.chicago_drives = set()
        self.scoring_drives = set()

    def observe(self, r, num):
        offense = r.get("posteam")
        if not offense or offense == "NA": return
        game = r.get("game_id")
        drive = r.get("fixed_drive") or r.get("drive")
        if drive == "NA": drive = r.get("drive")
        key = (game, drive, offense) if game and game != "NA" and drive and drive != "NA" else None
        chicago = offense == "CHI"
        passing = num(r,"pass_attempt")==1 and num(r,"sack")!=1
        rushing = num(r,"rush_attempt")==1 and num(r,"qb_kneel")!=1 and not passing
        pass_td = passing and num(r,"pass_touchdown")==1
        rush_td = rushing and num(r,"rush_touchdown")==1
        if key and (pass_td or rush_td):
            self.scoring_drives.add(key)
        zone = band(num(r,"yardline_100"))
        if zone is None: return
        # Count a drive that takes a normal offensive snap in the red zone.
        if key and (passing or rushing or num(r,"sack")==1):
            self.drives.add(key)
            if chicago:self.chicago_drives.add(key)
        if not passing and not rushing: return
        for group in (self.league, self.team) if chicago else (self.league,):
            v=group[zone]
            v["pass" if passing else "rush"]+=1
            v["passTd"]+=int(pass_td);v["rushTd"]+=int(rush_td)
            e=num(r,"epa")
            if e is not None:v["epaSum"]+=e;v["epaCount"]+=1
        if not chicago:return
        def player(field):
            pid=r.get(field)
            return self.players[pid][zone] if pid and pid!="NA" else None
        if passing:
            p=player("passer_player_id")
            if p is not None:p["passAttempts"]+=1;p["passTd"]+=int(pass_td)
            p=player("receiver_player_id")
            if p is not None:
                p["targets"]+=1;p["receptions"]+=int(num(r,"complete_pass")==1);p["recTd"]+=int(pass_td)
        if rushing:
            p=player("rusher_player_id")
            if p is not None:p["carries"]+=1;p["rushTd"]+=int(rush_td)

    def export(self, ids):
        def serialize(v):
            total=v["pass"]+v["rush"]
            return {"pass":v["pass"],"rush":v["rush"],"passTd":v["passTd"],"rushTd":v["rushTd"],
                    "epa":v["epaSum"]/v["epaCount"] if v["epaCount"] else None,
                    "tdRate":(v["passTd"]+v["rushTd"])/total if total else None}
        return {"bands":[{"id":b,"team":serialize(self.team[b]),"league":serialize(self.league[b])} for b in BANDS],
                "drives":{"team":len(self.chicago_drives),"teamTd":len(self.chicago_drives & self.scoring_drives),
                          "league":len(self.drives),"leagueTd":len(self.drives & self.scoring_drives)},
                "players":[{"gsisId":pid,"espnId":ids.get(pid),"bands":[{"id":b,**by_band[b]} for b in BANDS]} for pid,by_band in self.players.items()]}
